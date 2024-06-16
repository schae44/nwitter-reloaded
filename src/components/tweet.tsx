import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
/////////////////////////////////
const EditButton = styled.button`
  background-color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const PhotoWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin-left: 20px;
`;

const EditText = styled.textarea`
  width: 100%;
  padding: 20px;
  background-color: black;
  border: 2px solid white;
  border-radius: 20px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: white;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isLoading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedTweet, setEditedTweet] = useState("");

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId || isLoading) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      //console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onFileDelete = async () => {
    if (user?.uid !== userId || isLoading) return;
    try {
      setLoading(true);
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
        await updateDoc(doc(db, "tweets", id), { photo: null });
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const onEditClick = () => {
    if (user?.uid !== userId || isLoading) return;
    setEdit(true);
  };

  const onSaveClick = async () => {
    if (!edit || isLoading) return;
    if (editedTweet === "") {
      setEdit(false);
      return;
    }
    try {
      setLoading(true);
      await updateDoc(doc(db, "tweets", id), { tweet: editedTweet });
    } catch (error) {
    } finally {
      setLoading(false);
      setEdit(false);
      setEditedTweet("");
    }
  };

  const onEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTweet(e.target.value);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {edit ? (
          <EditText value={editedTweet} onChange={onEdit}></EditText>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <>
            {edit ? (
              <EditButton onClick={onSaveClick}>Save</EditButton>
            ) : (
              <EditButton onClick={onEditClick}>Edit</EditButton>
            )}
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </>
        ) : null}
      </Column>
      <Column>
        {photo ? (
          <PhotoWrapper>
            <Photo src={photo} />
            <DeleteButton onClick={onFileDelete}>X</DeleteButton>
          </PhotoWrapper>
        ) : null}
      </Column>
    </Wrapper>
  );
}
