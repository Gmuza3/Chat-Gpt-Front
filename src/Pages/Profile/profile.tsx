import { useQuery } from "react-query";
import api from "../../Config/axios.api";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import React from "react";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    minWidth:'180px',
    top: "10%",
    left: "auto",
    right: "24px",
    bottom: "auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const getProfile = async () => {
    const res = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  };

  const {
    data: profileData,
    isLoading,
    isError,
    refetch: refetchProfile,
  } = useQuery("profileData", getProfile, {
    retry: false,
    refetchOnWindowFocus: false,
    onError:() =>{
      refetchToken();
    }
  });

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/refresh-token");
      const newAccessToken = res.data.accessToken;
      localStorage.setItem("token", newAccessToken);
      return newAccessToken;
    } catch (err) {
      if(err instanceof Error){
        throw new Error(err.message);
      }
      localStorage.removeItem("token");
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict;";

      navigate("/login");
    }
  };
  const logoutUser = useCallback(async () => {
    try {
      const res = await api.post("/logout");
      localStorage.removeItem("token");
      navigate("/login");
      closeModal();
      return res.data;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }, []);

  const { refetch: refetchToken } = useQuery(
    "refreshToken",
    refreshAccessToken,
    {
      enabled: false,
      onSuccess: () => {
        refetchProfile();
      },
    }
  );
  useEffect(() => {
    if (isLoading && isError && !profileData) {
      refetchToken();
    }
  }, [isError, profileData,isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (isError && !profileData) {
    return <div>Error fetching profile</div>; 
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      {!isLoading && profileData &&(
        <div className="absolute top-0 right-6 z-50">
          <button
            className="bg-indigo-500 border-[1px] border-solid border-transparent rounded-full cursor-pointer"
            onClick={openModal}
          >
            {profileData ? (
              <h2 className="px-2 py-1 uppercase">
                {profileData.email.slice(0, 2)}
              </h2>
            ) : (
              <div>No profile data available</div>
            )}
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <ul className="flex flex-col items-start gap-3">
              <li className="">
                <button
                  onClick={() => {
                    navigate("/profile");
                    closeModal();
                  }}
                  className="flex items-center gap-3 cursor-pointer font-custom text-base font-semibold "
                >
                  <CgProfile color={"black"} fontWeight="300" size={22} />{" "}
                  Profile
                </button>
              </li>
              <div className="mt-0 border-b-[2px] border-gray-300 w-full"></div>
              <li>
                <button
                  onClick={logoutUser}
                  className="flex items-center gap-3 cursor-pointer font-custom text-base font-semibold"
                >
                  <MdLogout color={"black"} fontWeight="300" size={22} />
                  Log out
                </button>
              </li>
            </ul>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Profile;
