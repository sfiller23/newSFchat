import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../main";

export async function uploadAvatar(
  e: Event,
  file: File | Blob,
  userId: string
) {
  e.stopPropagation();
  e.preventDefault();

  const storageRef = ref(storage, `profileImages/${userId}`);

  try {
    await uploadBytes(storageRef, file);
  } catch (error) {
    alert(error);
  }
}

export async function createEntity(
  collection: string,
  id: string,
  newObj: object
) {
  try {
    await setDoc(doc(db, collection, id), newObj);
  } catch (error) {
    alert(error);
  }
}

export async function updateEntity(
  collection: string,
  id: string,
  newObj: object
) {
  try {
    await updateDoc(doc(db, collection, id), newObj);
  } catch (error) {
    console.error(error);
  }
}

export async function getAllEntities(entity: string) {
  try {
    const res = await getDocs(collection(db, entity));
    const entityArray = res.docs.map((doc) => doc.data());
    return entityArray;
  } catch (error) {
    alert(error);
  }
}

export async function getEntityFromCollection(
  entity: string,
  selector: string
) {
  try {
    const res = await getDoc(doc(db, entity, selector));
    return res.data();
  } catch (error) {
    alert(error);
  }
}

export async function getAvatar(userId: string): Promise<string | undefined> {
  const storageRef = ref(storage);

  const imgUrl = await getDownloadURL(
    ref(storageRef, `profileImages/${userId}`)
  );
  return imgUrl;
}
