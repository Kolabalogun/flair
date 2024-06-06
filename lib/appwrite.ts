import {
  CreateNewsEventFormType,
  CreateNewsFormType,
} from "@/app/(tabs)/create";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ibrahim.flair",
  projectId: "665f0d97000a21a317bb",
  databaseId: "665f0dfb00027da3e2cf",
  userCollectionId: "665f0e030011ae4f1559",
  newsCollectionId: "665f0eaf002eb8653dac",
  commentsCollectionId: "6660235e002445f534a4",
  eventsCollectionId: "66610230000e4247233f",
  eventcommentsCollectionId: "66618576002aa6d75458",
  eventTicketCollectionId: "666195eb00332848e84f",
  storageId: "665f1b8c00331df6f9e0",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);

// for avatars

const avatars = new Avatars(client);

// database
const database = new Databases(client);

// storage
const storage = new Storage(client);

// Register User
export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
        role: "user",
      }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

// Get  posts created by user
export async function checkIfUserIsInDB(email: string) {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("email", email)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.newsCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getAllEvents() {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.eventsCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getTrendingNews() {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.newsCollectionId,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(7),
        Query.equal("trending", true),
      ]
    );

    return posts.documents;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

// Get  posts that matches search query
export async function searchPosts(query: string) {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.newsCollectionId,
      [
        Query.or([
          Query.search("title", query),
          Query.search("author", query),
          Query.search("documentId", query),
        ]),
      ]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Get  posts that matches search query
export async function searchEvents(query: string) {
  try {
    const events = await database.listDocuments(
      config.databaseId,
      config.eventsCollectionId,
      [
        Query.or([
          Query.search("title", query),
          Query.search("author", query),
          Query.search("documentId", query),
          Query.search("location", query),
        ]),
      ]
    );

    if (!events) throw new Error("Something went wrong");

    return events.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Get  event that matches search query
export async function searchTicket(
  query: string | null,
  userId?: string | null
) {
  if (query) {
    try {
      const events = await database.listDocuments(
        config.databaseId,
        config.eventTicketCollectionId,
        userId
          ? [Query.search("postId", query), Query.search("userId", userId)]
          : [Query.search("postId", query)]
      );

      if (!events) throw new Error("Something went wrong");

      return events.documents;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get  posts created by user
export async function getUserPosts(userId: string, type?: string) {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      type === "event" ? config.eventsCollectionId : config.newsCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file: any, type: string) {
  if (!file) return;

  const asset = {
    type: file.mimeType,
    name: file.fileName,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId: string, type: string) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Create  Post
export async function createVideoPost(form: CreateNewsFormType) {
  try {
    const [thumbnailUrl] = await Promise.all([uploadFile(form.image, "image")]);

    const postId = ID.unique();

    const newPost = await database.createDocument(
      config.databaseId,
      config.newsCollectionId,
      postId,
      {
        title: form.title,
        image: thumbnailUrl,
        author: form.author,
        desc: form.desc,
        creator: form.creator,
        type: form.type,
        trending: form.trending,
        documentId: postId,
        likes: [],
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Create  Event
export async function createEventPost(form: CreateNewsEventFormType) {
  try {
    const [thumbnailUrl] = await Promise.all([uploadFile(form.image, "image")]);

    const postId = ID.unique();

    const newPost = await database.createDocument(
      config.databaseId,
      config.eventsCollectionId,
      postId,
      {
        title: form.title,
        image: thumbnailUrl,
        author: form.author,
        desc: form.desc,
        date: form.date,
        timee: form.time,
        creator: form.creator,
        options: form.options,
        trending: form.trending,
        entryFee: form.entryFee,
        reservation: form.seat,
        location: form.location,
        documentId: postId,
        likes: [],
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Update Post
export async function updateVideoPost(form: any) {
  console.log(form);

  try {
    const { collectionId, ...updatedForm } = form;

    const newPost = await database.updateDocument(
      config.databaseId,
      collectionId,
      form.documentId,
      updatedForm
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Create Comment Post
export async function createCommentPost(form: any, event?: string) {
  try {
    // Determine the collection ID based on the event flag
    const collectionId =
      event === "event"
        ? config.eventcommentsCollectionId
        : event === "ticket"
        ? config.eventTicketCollectionId
        : config.commentsCollectionId;

    // Create the document data based on whether it is an event or news comment
    const data =
      event === "event"
        ? { event_id: form.event_id, desc: form.comment, creator: form.creator }
        : event === "ticket"
        ? { ...form }
        : { news_id: form.news_id, desc: form.comment, creator: form.creator };

    // Create the new post in the database
    const newPost = await database.createDocument(
      config.databaseId,
      collectionId,
      ID.unique(),
      data
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllComments(id: string | null, event?: boolean) {
  if (id) {
    try {
      const comments = await database.listDocuments(
        config.databaseId,
        event ? config.eventcommentsCollectionId : config.commentsCollectionId,
        event
          ? [Query.orderDesc("$createdAt"), Query.equal("event_id", id)]
          : [Query.orderDesc("$createdAt"), Query.equal("news_id", id)]
      );

      return comments.documents;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
}

// Create Comment Post
export async function deletePost(form: any) {
  try {
    const newPost = await database.deleteDocument(
      config.databaseId,
      form.collectionId,
      form.documentId
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}
