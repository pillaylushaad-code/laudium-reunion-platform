import "./PhotoGalleryPage.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentContext from "../../context/StudentContext";
import { supabase } from "../../lib/supabase";

function PhotoGalleryPage() {
  const navigate = useNavigate();
  const { loggedInStudent } = useContext(StudentContext);

  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [galleryError, setGalleryError] = useState("");

  const [isCommitteeMember, setIsCommitteeMember] =
    useState(false);
  const [checkingPermission, setCheckingPermission] =
    useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [selectedPhotoIndex, setSelectedPhotoIndex] =
    useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const lightboxOpen = selectedPhotoIndex !== null;

  useEffect(() => {
    async function loadGalleryPhotos() {
      setLoadingPhotos(true);
      setGalleryError("");

      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(
          "Failed to load gallery photos:",
          error,
        );

        setGalleryError(
          "Unable to load the photo gallery.",
        );
        setLoadingPhotos(false);
        return;
      }

      setPhotos(data || []);
      setLoadingPhotos(false);
    }

    loadGalleryPhotos();
  }, []);

  useEffect(() => {
    async function checkCommitteePermission() {
      if (!loggedInStudent) {
        setIsCommitteeMember(false);
        setCheckingPermission(false);
        return;
      }

      setCheckingPermission(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Failed to get current session:",
          sessionError,
        );

        setIsCommitteeMember(false);
        setCheckingPermission(false);
        return;
      }

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        console.error(
          "No active Supabase session found.",
        );

        setIsCommitteeMember(false);
        setCheckingPermission(false);
        return;
      }

      const { data, error } =
        await supabase.functions.invoke(
          "gallery-upload",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

      if (error) {
        console.error(
          "Failed to check gallery permissions:",
          error,
        );

        setIsCommitteeMember(false);
        setCheckingPermission(false);
        return;
      }

      setIsCommitteeMember(
        data?.isCommitteeMember === true,
      );

      setCheckingPermission(false);
    }

    checkCommitteePermission();
  }, [loggedInStudent]);

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
    setUploadMessage("");
    setUploadError("");
  }

  async function handleUpload(event) {
    event.preventDefault();

    setUploadMessage("");
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Please choose a photo first.");
      return;
    }

    setUploading(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Failed to get current session:",
          sessionError,
        );

        setUploadError(
          "Unable to verify your login session.",
        );
        return;
      }

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        setUploadError(
          "Your login session has expired. Please log in again.",
        );
        return;
      }

      const formData = new FormData();

      formData.append("file", selectedFile);

      if (caption.trim()) {
        formData.append(
          "caption",
          caption.trim(),
        );
      }

      const { data, error } =
        await supabase.functions.invoke(
          "gallery-upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          },
        );

      if (error) {
        console.error(
          "Gallery upload failed:",
          error,
        );

        setUploadError(
          error.message ||
            "Unable to upload the photo.",
        );
        return;
      }

      if (!data?.success || !data.photo) {
        setUploadError(
          data?.error ||
            "Unable to upload the photo.",
        );
        return;
      }

      setPhotos((currentPhotos) => [
        ...currentPhotos,
        data.photo,
      ]);

      setSelectedFile(null);
      setCaption("");
      setUploadMessage(
        "Photo uploaded successfully.",
      );

      const fileInput = document.getElementById(
        "gallery-photo-upload",
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Gallery upload error:",
        error,
      );

      setUploadError(
        "Unable to connect to the gallery server.",
      );
    } finally {
      setUploading(false);
    }
  }

  function openPhoto(index) {
    setSelectedPhotoIndex(index);
    setZoom(1);
    setRotation(0);
  }

  function closePhoto() {
    setSelectedPhotoIndex(null);
    setZoom(1);
    setRotation(0);
  }

  function zoomIn() {
    setZoom((currentZoom) =>
      Math.min(currentZoom + 0.25, 3),
    );
  }

  function zoomOut() {
    setZoom((currentZoom) =>
      Math.max(currentZoom - 0.25, 0.5),
    );
  }

  function rotateLeft() {
    setRotation(
      (currentRotation) =>
        currentRotation - 90,
    );
  }

  function rotateRight() {
    setRotation(
      (currentRotation) =>
        currentRotation + 90,
    );
  }

  function resetPhotoView() {
    setZoom(1);
    setRotation(0);
  }

  function showPreviousPhoto() {
    setZoom(1);
    setRotation(0);

    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === 0) {
        return photos.length - 1;
      }

      return currentIndex - 1;
    });
  }

  function showNextPhoto() {
    setZoom(1);
    setRotation(0);

    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === photos.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });
  }

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [lightboxOpen, photos.length]);

  return (
    <main className="photo-gallery-page">
      <header className="photo-gallery-header">
        <h1>Photo Gallery</h1>

        <p>
          Relive the memories from our school years and
          reunion.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      {isCommitteeMember &&
        !checkingPermission && (
          <section className="gallery-upload-section">
            <h2>Upload Reunion Photo</h2>

            <form onSubmit={handleUpload}>
              <input
                id="gallery-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              <input
                type="text"
                placeholder="Caption (optional)"
                value={caption}
                onChange={(event) =>
                  setCaption(event.target.value)
                }
              />

              <button
                type="submit"
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Photo"}
              </button>
            </form>

            {selectedFile && (
              <p>
                Selected: {selectedFile.name}
              </p>
            )}

            {uploadMessage && (
              <p>{uploadMessage}</p>
            )}

            {uploadError && (
              <p>{uploadError}</p>
            )}
          </section>
        )}

      {loadingPhotos && (
        <p>Loading gallery photos...</p>
      )}

      {galleryError && (
        <p>{galleryError}</p>
      )}

      {!loadingPhotos &&
        !galleryError &&
        photos.length === 0 && (
          <p>
            No gallery photos have been uploaded yet.
          </p>
        )}

      {!loadingPhotos &&
        !galleryError &&
        photos.length > 0 && (
          <section className="photo-gallery-grid">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                className="photo-gallery-item"
                onClick={() => openPhoto(index)}
                aria-label={`Open school memory ${
                  index + 1
                }`}
              >
                <img
                  src={photo.public_url}
                  alt={
                    photo.caption ||
                    `School memory ${index + 1}`
                  }
                />
              </button>
            ))}
          </section>
        )}

      {lightboxOpen && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closePhoto}
        >
          <button
            className="photo-lightbox-close"
            onClick={closePhoto}
            aria-label="Close photo viewer"
          >
            ×
          </button>

          <button
            className="photo-lightbox-previous"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousPhoto();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <img
            className="photo-lightbox-image"
            src={
              photos[selectedPhotoIndex].public_url
            }
            alt={
              photos[selectedPhotoIndex].caption ||
              `School memory ${
                selectedPhotoIndex + 1
              }`
            }
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          <div
            className="photo-lightbox-tools"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              onClick={zoomOut}
              aria-label="Zoom out"
            >
              −
            </button>

            <span className="photo-zoom-level">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={zoomIn}
              aria-label="Zoom in"
            >
              +
            </button>

            <span className="photo-tool-divider" />

            <button
              onClick={rotateLeft}
              aria-label="Rotate left"
            >
              ↺
            </button>

            <button
              onClick={rotateRight}
              aria-label="Rotate right"
            >
              ↻
            </button>

            <button
              onClick={resetPhotoView}
              aria-label="Reset photo view"
            >
              Reset
            </button>
          </div>

          <button
            className="photo-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNextPhoto();
            }}
            aria-label="Next photo"
          >
            ›
          </button>

          <p className="photo-lightbox-counter">
            {selectedPhotoIndex + 1} /{" "}
            {photos.length}
          </p>
        </div>
      )}
    </main>
  );
}

export default PhotoGalleryPage;