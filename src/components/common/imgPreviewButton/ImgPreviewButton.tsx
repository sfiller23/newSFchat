import { BaseSyntheticEvent, useState } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { RiImageAddFill } from "react-icons/ri";
import { uploadAvatar } from "../../../api/firebase/api";
import { PreviewState } from "../../../constants/enums";
import type { User } from "../../../interfaces/auth";
import { useHandleImgPick } from "../../../utils/Hooks";
import "./_img-preview-button.scss";

interface imgPreviewButtonProps {
  action?: PreviewState;
  inForm?: boolean;
  currentUser: User;
  setLoadingState: (isLoading: boolean) => void;
  setImageProfileChange: () => void;
}

const ImgPreviewButton = (props: imgPreviewButtonProps) => {
  const {
    action = PreviewState.ADD,
    inForm = true,
    setLoadingState,
    setImageProfileChange,
    currentUser,
  } = props;

  const { picture, setPicture, imgData, handleImgPreview } = useHandleImgPick();

  const [isPreview, setIsPreview] = useState(false);

  const handleAvatarUpload = async (e: BaseSyntheticEvent | Event) => {
    try {
      setLoadingState(true);
      if (picture && currentUser.userId) {
        await uploadAvatar(e as Event, picture, currentUser.userId);
      }

      setPicture(null);
      setIsPreview(false);
      setImageProfileChange();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      <input
        type="file"
        name="avatar"
        id="avatar"
        style={{ display: `${!picture ? "none" : "block"}` }}
        onChange={(e) => {
          e.preventDefault();
          handleImgPreview(e);
          setIsPreview(true);
        }}
      />

      {!inForm && imgData && isPreview && (
        <button onClick={handleAvatarUpload} className="avatar-upload-button">
          <HiOutlineCloudUpload className="upload-avatar-icon" size={20} />
          <label className="upload-avatar-label">Upload</label>
        </button>
      )}
      <>
        {!picture && (
          <label className="avatar-label" htmlFor="avatar">
            <RiImageAddFill size={20} />
            <span>{`${action} ${
              action === PreviewState.ADD ? "an" : "the"
            } Avatar`}</span>
          </label>
        )}
        {imgData && isPreview && (
          <img
            className="img-preview"
            src={imgData as string}
            alt="Image Preview"
          />
        )}
      </>
    </>
  );
};

export default ImgPreviewButton;
