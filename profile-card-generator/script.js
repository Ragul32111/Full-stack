import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTuBNXKnuFK9BtrR6hS8vQ67cv3xMtKlw",
  authDomain: "js-crud-bbda4.firebaseapp.com",
  databaseURL: "https://js-crud-bbda4-default-rtdb.firebaseio.com",
  projectId: "js-crud-bbda4",
  storageBucket: "js-crud-bbda4.firebasestorage.app",
  messagingSenderId: "462390741647",
  appId: "1:462390741647:web:e5b42e1630bc0de9d5fefa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
const provider = new GithubAuthProvider();

// Elements
const signInPage = document.getElementById("signInPage");
const welcomePage = document.getElementById("welcomePage");
const githubLoginBtn = document.getElementById("githubLoginBtn");
const signOutBtn = document.getElementById("signOutBtn");
const profileForm = document.getElementById("profileForm");
const profileCard = document.getElementById("profileCard");
const downloadProfileBtn = document.getElementById("downloadProfileBtn");

// GitHub Login
githubLoginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    signInPage.classList.add("hidden");
    welcomePage.classList.remove("hidden");
    profileForm.classList.remove("hidden");

    fetchProfileData(user);
  } catch (error) {
    console.error("GitHub login failed:", error);
    alert("Login failed. Please try again.");
  }
});

// Profile Form Submission
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;

  if (!user) {
    alert("You need to log in first.");
    return;
  }

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image").files[0];

  if (!imageInput) {
    alert("Please select a profile picture.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    const imageURL = reader.result;

    try {
      await set(ref(db, `users/${user.uid}`), {
        name: name,
        description: description,
        image: imageURL,
      });

      displayProfileCard(name, description, imageURL);
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Failed to save profile. Please try again.");
    }
  };
  reader.readAsDataURL(imageInput);
});

// Fetch Profile Data
async function fetchProfileData(user) {
  const profileRef = ref(db, `users/${user.uid}`);
  const snapshot = await get(profileRef);

  if (snapshot.exists()) {
    const profile = snapshot.val();
    displayProfileCard(profile.name, profile.description, profile.image);
  } else {
    console.log("No profile data found.");
  }
}

// Display Profile Card
function displayProfileCard(name, description, imageURL) {
  profileCard.innerHTML = `
    <div>
      <img src="${imageURL}" alt="Profile Picture" style="border-radius: 50%; width: 150px; height: 150px;">
      <br><br>
      <h2>${name}</h2><br>
      <p>${description}</p>
    </div>
  `;
  profileCard.classList.remove("hidden");
  downloadProfileBtn.classList.remove("hidden");

  downloadProfileBtn.onclick = () => {
    downloadProfileImage(imageURL, name, description);
  };
}

// Download Profile Image
function downloadProfileImage(imageURL, username, description) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const imgElement = new Image();
  imgElement.src = imageURL;
  imgElement.onload = function () {
    const imgWidth = 150;
    const imgHeight = 150;
    const textPadding = 50;
    const lineHeight = 30;

    ctx.font = "16px Arial";
    const textLines = wrapText(ctx, description, imgWidth + textPadding * 2);
    const textHeight = textLines.length * lineHeight;

    const canvasWidth = imgWidth + textPadding * 2;
    const canvasHeight =
      imgHeight + textPadding * 2 + 60 + textHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      canvasWidth / 2,
      textPadding + imgHeight / 2,
      imgWidth / 2 + 5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#000279";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(
      canvasWidth / 2,
      textPadding + imgHeight / 2,
      imgWidth / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      imgElement,
      (canvasWidth - imgWidth) / 2,
      textPadding,
      imgWidth,
      imgHeight
    );
    ctx.restore();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(username, canvasWidth / 2, imgHeight + textPadding + 20);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#555";
    ctx.textAlign = "center";
    textLines.forEach((line, index) => {
      ctx.fillText(
        line,
        canvasWidth / 2,
        imgHeight + textPadding + 50 + index * lineHeight
      );
    });

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg");
    a.download = `${username.replace(/\s+/g, "_").toLowerCase()}_profile_card.jpg`;
    a.click();
  };
}

// Wrap Text Helper Function
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Sign Out
signOutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);

    welcomePage.classList.add("hidden");
    signInPage.classList.remove("hidden");
    profileForm.reset();
    profileForm.classList.add("hidden");
    profileCard.classList.add("hidden");
    downloadProfileBtn.classList.add("hidden");
  } catch (error) {
    console.error("Sign-out failed:", error);
    alert("Sign-out failed. Please try again.");
  }
});
