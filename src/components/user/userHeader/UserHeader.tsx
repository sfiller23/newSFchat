import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../UI/loader/Loader";
import { getAvatar } from "../../../api/firebase/api";
import { PreviewState } from "../../../constants/enums";
import { useAppContext } from "../../../context/appContext/useAppContext";
import type { User } from "../../../interfaces/auth";
import { logoutReq } from "../../../redux/auth/authThunk";
import { clearChat } from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import "./_user-header.scss";
import ImgPreviewButton from "./imgPreviewButton/ImgPreviewButton";

/**
 * UserHeader Component
 * This component displays the header for the current user, including their profile image, display name,
 * and a logout button. It also allows the user to add or edit their profile image.
 */

const UserHeader = (props: { currentUser: User }) => {
  const { currentUser } = props;

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const {
    setImageProfile,
    setLoadingState,
    setImageProfileChange,
    imgProfileUrl,
    isLoading,
    imgProfileChange,
  } = useAppContext();

  const userId = localStorage.getItem("userId");

  /**
   * Fetches the user's profile image URL from Firebase Storage.
   * Updates the app context with the retrieved image URL.
   */
  useEffect(() => {
    let imgUrl: string | undefined = "";
    const getProfileUrl = async () => {
      try {
        if (userId) {
          setLoadingState(true);
          imgUrl = await getAvatar(userId);
          if (imgUrl) {
            setImageProfile(imgUrl);
          }
        }
      } catch {
        console.log("No image file");
      } finally {
        setLoadingState(false);
      }
    };
    getProfileUrl();
  }, [userId, imgProfileChange, setLoadingState, setImageProfile]);

  const logOutHandler = async () => {
    try {
      if (currentUser) {
        await dispatch(logoutReq(currentUser.userId));
        dispatch(clearChat());
        navigate("/");
      }
    } catch (error) {
      console.log(`${error} in logOutHandler`);
    }
  };

  return (
    <div className={`user-header ${!imgProfileUrl ? "no-image" : ""}`}>
      {isLoading ? (
        <Loader className="profile-image-loader" />
      ) : (
        <>
          <div className="display-name-container">
            <h3>{currentUser.displayName}</h3>
          </div>
          {/* Display the user's profile image and the image preview button */}
          <span className="user-img-container">
            {!!imgProfileUrl && (
              <img
                className="user-img"
                src={imgProfileUrl}
                alt="Profile Image"
              />
            )}
            <ImgPreviewButton
              currentUser={currentUser}
              setLoadingState={setLoadingState}
              setImageProfileChange={setImageProfileChange}
              action={!imgProfileUrl ? PreviewState.ADD : PreviewState.EDIT}
            />
          </span>
        </>
      )}

      <span>
        <button type="button" onClick={logOutHandler} className="logout-button">
          Logout
        </button>
      </span>
    </div>
  );
};

export default UserHeader;
