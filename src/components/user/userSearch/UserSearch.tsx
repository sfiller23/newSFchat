import { type BaseSyntheticEvent } from "react";
import { searchUser } from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import "./_user-search.scss";

const UserSearch = () => {
  const dispatch = useAppDispatch();

  const search = (e: BaseSyntheticEvent | Event) => {
    dispatch(searchUser((e.target.value as string).toLocaleLowerCase()));
  };
  return (
    <div className="search-input-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search Users..."
        onChange={search}
      />
    </div>
  );
};

export default UserSearch;
