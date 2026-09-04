import { useContext, useState } from "react";
import "./CreateprofilePage.css";
import StudentContext from "../../context/StudentContext";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function CreateProfilePage() {
  const { loggedInStudent, updateStudent } = useContext(StudentContext);
  const navigate = useNavigate();

  // CURRENT DETAILS
  const [currentFirstName, setCurrentFirstName] = useState(
    loggedInStudent?.currentFirstName ?? "",
  );
  const [currentSurname, setCurrentSurname] = useState(
    loggedInStudent?.currentSurname ?? "",
  );
  const [detailsSaved, setDetailsSaved] = useState(false);

  // PROFILE PHOTO
  const [selectedPhoto, setSelectedPhoto] = useState(
    loggedInStudent?.profilePhoto ?? null,
  );
  const [photoSaved, setPhotoSaved] = useState(false);

  // OCCUPATION
  const [occupation, setOccupation] = useState(
    loggedInStudent?.occupation ?? "",
  );
  const [occupationSaved, setOccupationSaved] = useState(false);

  // BIO
  const [bio, setBio] = useState(loggedInStudent?.bio ?? "");
  const [bioSaved, setBioSaved] = useState(false);

  // LIFE MOTTO
  const [lifeMotto, setLifeMotto] = useState(loggedInStudent?.lifeMotto ?? "");
  const [lifeMottoSaved, setLifeMottoSaved] = useState(false);

  // BUSINESS
  const [businessName, setBusinessName] = useState(
    loggedInStudent?.businessName ?? "",
  );
  const [businessDescription, setBusinessDescription] = useState(
    loggedInStudent?.businessDescription ?? "",
  );
  const [businessLink, setBusinessLink] = useState(
    loggedInStudent?.businessLink ?? "",
  );
  const [businessSaved, setBusinessSaved] = useState(false);

  // SOCIAL MEDIA
  const [facebook, setFacebook] = useState(loggedInStudent?.facebook ?? "");
  const [instagram, setInstagram] = useState(loggedInStudent?.instagram ?? "");
  const [linkedin, setLinkedin] = useState(loggedInStudent?.linkedin ?? "");
  const [socialSaved, setSocialSaved] = useState(false);

  if (!loggedInStudent) {
    return null;
  }

  function handleSaveCurrentDetails() {
    updateStudent({
      currentFirstName,
      currentSurname,
    });

    setDetailsSaved(true);
  }

  function handlePhotoSelection(event) {
    const file = event.target.files[0];

    if (!file) return;

    setPhotoSaved(false);

    const previewUrl = URL.createObjectURL(file);
    setSelectedPhoto(previewUrl);
  }

  async function handleSavePhoto() {
    const fileInput = document.getElementById("profilePhoto");
    const file = fileInput?.files?.[0];

    if (!file) {
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Could not get logged-in user:", userError);
        return;
      }

      const fileExtension = file.name.split(".").pop();
      const filePath = `${user.id}/profile-photo-${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Photo upload failed:", uploadError);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

      const previousPhoto = loggedInStudent.profilePhoto;

      const result = await updateStudent({
        profilePhoto: publicUrl,
      });

      if (!result.success) {
        console.error("Failed to save photo URL:", result.error);

        await supabase.storage.from("profile-photos").remove([filePath]);

        return;
      }

      setSelectedPhoto(publicUrl);
      setPhotoSaved(true);

      if (
        previousPhoto &&
        previousPhoto.includes("/storage/v1/object/public/profile-photos/")
      ) {
        const oldPath = decodeURIComponent(
          previousPhoto.split("/storage/v1/object/public/profile-photos/")[1],
        );

        await supabase.storage.from("profile-photos").remove([oldPath]);
      }
    } catch (error) {
      console.error("Unexpected photo upload error:", error);
    }
  }

  function handleSaveOccupation() {
    updateStudent({
      occupation,
    });

    setOccupationSaved(true);
  }

  function handleSaveBio() {
    updateStudent({
      bio,
    });

    setBioSaved(true);
  }

  function handleSaveLifeMotto() {
    updateStudent({
      lifeMotto,
    });

    setLifeMottoSaved(true);
  }

  function handleSaveBusiness() {
    updateStudent({
      businessName,
      businessDescription,
      businessLink,
    });

    setBusinessSaved(true);
  }

  function handleSaveSocialMedia() {
    updateStudent({
      facebook,
      instagram,
      linkedin,
    });

    setSocialSaved(true);
  }

  function handleFinishProfile() {
    updateStudent({
      currentFirstName,
      currentSurname,
      profilePhoto: selectedPhoto,
      occupation,
      bio,
      lifeMotto,
      businessName,
      businessDescription,
      businessLink,
      facebook,
      instagram,
      linkedin,
      profileCompleted: true,
    });

    navigate("/profile");
  }

  return (
    <main className="create-profile-page">
      {/* PAGE HEADER */}
      <header className="profile-form-header">
        <span className="profile-form-eyebrow">Class of 2013</span>

        <h1>Create Your Reunion Profile</h1>

        <p>
          Tell your classmates who you are today while keeping a piece of where
          we came from.
        </p>
      </header>

      {/* HISTORICAL RECORD */}
      <section className="historical-record profile-section">
        <div className="section-heading">
          <span className="section-kicker">Where it began</span>
          <h2>Your School Record</h2>
          <p>This is the identity you brought with you from school.</p>
        </div>

        <div className="school-record-grid">
          <div className="record-item">
            <span className="record-label">Name</span>
            <strong>
              {loggedInStudent.schoolFirstName} {loggedInStudent.schoolSurname}
            </strong>
          </div>

          <div className="record-item">
            <span className="record-label">Class</span>
            <strong>{loggedInStudent.class}</strong>
          </div>
        </div>
      </section>

      {/* CURRENT DETAILS */}
      <section className="current-details profile-section">
        <div className="section-heading">
          <span className="section-kicker">Who you are today</span>
          <h2>Current Details</h2>
          <p>
            Your name may have changed since 2013. Tell us what your classmates
            should call you today.
          </p>
        </div>

        <div className="form-grid form-grid-two">
          <div className="form-field">
            <label htmlFor="currentFirstName">Current First Name</label>

            <input
              id="currentFirstName"
              type="text"
              value={currentFirstName}
              onChange={(event) => {
                setCurrentFirstName(event.target.value);
                setDetailsSaved(false);
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="currentSurname">Current Surname</label>

            <input
              id="currentSurname"
              type="text"
              value={currentSurname}
              onChange={(event) => {
                setCurrentSurname(event.target.value);
                setDetailsSaved(false);
              }}
            />
          </div>
        </div>

        <div className="section-action">
          <button onClick={handleSaveCurrentDetails}>
            Save Current Details
          </button>

          {detailsSaved && (
            <span className="save-confirmation">✓ Details saved</span>
          )}
        </div>
      </section>

      {/* ABOUT YOU */}
      <section className="about-you profile-section">
        <div className="section-heading">
          <span className="section-kicker">Your story</span>
          <h2>Tell Us About You</h2>
          <p>
            Give your classmates a glimpse of the person you became after
            leaving school.
          </p>
        </div>

        <div className="profile-about-layout">
          {/* PHOTO */}
          <div className="profile-photo-area">
            <div className="photo-preview">
              {selectedPhoto ? (
                <img src={selectedPhoto} alt="Profile preview" />
              ) : (
                <div className="photo-placeholder">
                  <span>+</span>
                  <p>Add your photo</p>
                </div>
              )}
            </div>

            <div className="photo-controls">
              <label htmlFor="profilePhoto">Choose Profile Photo</label>

              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={handlePhotoSelection}
              />

              <button onClick={handleSavePhoto}>Save Profile Photo</button>

              {photoSaved && (
                <span className="save-confirmation">✓ Photo saved</span>
              )}
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="personal-fields">
            <div className="form-field">
              <label htmlFor="occupation">Occupation</label>

              <input
                id="occupation"
                type="text"
                value={occupation}
                placeholder="What do you do?"
                onChange={(event) => {
                  setOccupation(event.target.value);
                  setOccupationSaved(false);
                }}
              />

              <div className="field-action">
                <button onClick={handleSaveOccupation}>Save Occupation</button>

                {occupationSaved && (
                  <span className="save-confirmation">✓ Saved</span>
                )}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="bio">About Me</label>

              <textarea
                id="bio"
                rows={6}
                placeholder="Tell your classmates a little about your journey..."
                value={bio}
                onChange={(event) => {
                  setBio(event.target.value);
                  setBioSaved(false);
                }}
              />

              <div className="field-action">
                <button onClick={handleSaveBio}>Save Bio</button>

                {bioSaved && <span className="save-confirmation">✓ Saved</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="lifeMotto">Life Motto</label>

              <textarea
                id="lifeMotto"
                rows={3}
                placeholder="A few words you live by..."
                value={lifeMotto}
                onChange={(event) => {
                  setLifeMotto(event.target.value);
                  setLifeMottoSaved(false);
                }}
              />

              <div className="field-action">
                <button onClick={handleSaveLifeMotto}>Save Life Motto</button>

                {lifeMottoSaved && (
                  <span className="save-confirmation">✓ Saved</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section className="business-information profile-section">
        <div className="section-heading">
          <span className="section-kicker">What you've built</span>
          <h2>Business & Work</h2>
          <p>
            If you've built a business or want to share what you do, give it a
            place here.
          </p>
        </div>

        <div className="form-grid form-grid-two">
          <div className="form-field">
            <label htmlFor="businessName">Business Name</label>

            <input
              id="businessName"
              type="text"
              value={businessName}
              placeholder="Your business name"
              onChange={(event) => {
                setBusinessName(event.target.value);
                setBusinessSaved(false);
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="businessLink">Business Website</label>

            <input
              id="businessLink"
              type="url"
              placeholder="https://example.com"
              value={businessLink}
              onChange={(event) => {
                setBusinessLink(event.target.value);
                setBusinessSaved(false);
              }}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="businessDescription">Business Description</label>

          <textarea
            id="businessDescription"
            rows={4}
            placeholder="Tell your classmates what your business does..."
            value={businessDescription}
            onChange={(event) => {
              setBusinessDescription(event.target.value);
              setBusinessSaved(false);
            }}
          />
        </div>

        <div className="section-action">
          <button onClick={handleSaveBusiness}>
            Save Business Information
          </button>

          {businessSaved && (
            <span className="save-confirmation">
              ✓ Business information saved
            </span>
          )}
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="social-media profile-section">
        <div className="section-heading">
          <span className="section-kicker">Stay connected</span>
          <h2>Social Media</h2>
          <p>Give your classmates a way to keep in touch beyond the reunion.</p>
        </div>

        <div className="form-grid form-grid-three">
          <div className="form-field">
            <label htmlFor="facebook">Facebook</label>

            <input
              id="facebook"
              type="url"
              placeholder="Facebook profile URL"
              value={facebook}
              onChange={(event) => {
                setFacebook(event.target.value);
                setSocialSaved(false);
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="instagram">Instagram</label>

            <input
              id="instagram"
              type="url"
              placeholder="Instagram profile URL"
              value={instagram}
              onChange={(event) => {
                setInstagram(event.target.value);
                setSocialSaved(false);
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="linkedin">LinkedIn</label>

            <input
              id="linkedin"
              type="url"
              placeholder="LinkedIn profile URL"
              value={linkedin}
              onChange={(event) => {
                setLinkedin(event.target.value);
                setSocialSaved(false);
              }}
            />
          </div>
        </div>

        <div className="section-action">
          <button onClick={handleSaveSocialMedia}>Save Social Media</button>

          {socialSaved && (
            <span className="save-confirmation">✓ Social media saved</span>
          )}
        </div>
      </section>

      {/* FINISH */}
      <section className="profile-completion">
        <div>
          <span className="section-kicker">Almost there</span>
          <h2>Ready to rejoin the class?</h2>
          <p>Save your profile and see how your classmates will see you.</p>
        </div>

        <button className="finish-profile-btn" onClick={handleFinishProfile}>
          Save Profile & View My Profile
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}

export default CreateProfilePage;
