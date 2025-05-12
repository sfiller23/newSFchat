import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../UI/loader/Loader";
import { PreviewState } from "../../../constants/enums";
import { AppContext } from "../../../context/appContext/AppContext";
import type { User } from "../../../interfaces/auth";
import { logoutReq } from "../../../redux/auth/authThunk";
import { clearChat } from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import ImgPreviewButton from "../../common/imgPreviewButton/ImgPreviewButton";
import "./_user-header.scss";

const UserHeader = (props: { currentUser: User }) => {
  const { currentUser } = props;

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const appContext = useContext(AppContext);

  const logOutHandler = async () => {
    try {
      if (currentUser) {
        //await setLoggedInState(false, user.userId);
        await dispatch(logoutReq(currentUser.userId));
        dispatch(clearChat());
        navigate("/");
      }
    } catch (error) {
      console.log(`${error} in logOutHandler`);
    }
  };

  return (
    <div
      className={`user-header ${
        !appContext?.state.imgProfileUrl ? "no-image" : ""
      }`}
    >
      {appContext?.state.isLoading ? (
        <Loader className="profile-image-loader" />
      ) : (
        <>
          <div className="display-name-container">
            <h3>{currentUser.displayName}</h3>
          </div>
          <span className="user-img-container">
            {!!appContext?.state.imgProfileUrl && (
              <img
                className="user-img"
                src={appContext?.state.imgProfileUrl}
                alt="Profile Image"
              />
            )}
            <ImgPreviewButton
              action={
                !appContext?.state.imgProfileUrl
                  ? PreviewState.EDIT
                  : PreviewState.ADD
              }
              inForm={false}
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
