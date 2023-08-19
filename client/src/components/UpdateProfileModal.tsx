import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { updateUser } from "../api/user/updateUser";
import { deleteUser } from "../api/user/deleteUser";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

const UpdateProfileModal = ({ handleModal }: { handleModal: () => void }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation(updateUser, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setError(data?.message);
      queryClient.invalidateQueries("user");
      if (data?.message === "User updated") {
        handleModal();
        if (user) {
          const updatedUser = {
            ...user,
            username: data.username,
            email: data.email,
          };
          setUser(updatedUser);
          setFormData({ username: "", email: "", password: "" });
        }
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const deleteUserMutation = useMutation(deleteUser, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setUser(null);
      navigate("/login");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email && !formData.username && !formData.password) {
      return setError("Please fill at least one field");
    }
    if (formData.username.length > 30) {
      setError("Username should be less than 30 characters");
      return;
    }

    if (formData.password && formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    updateUserMutation.mutate(formData);
  };

  const handleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleDeleteUser = () => {
    deleteUserMutation.mutate();
  };

  return (
    <div className="w-full min-h-full top-0 left-0 fixed z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white container max-w-2xl mx-5 p-5 rounded-xl shadow-xl">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xl sm:text-2xl">Edit Profile</h3>
          <button onClick={handleModal} className="text-xl text-gray-500">
            <IoClose />
          </button>
        </div>
        <form
          id="updateProfile"
          onSubmit={handleUpdate}
          className="py-5 border-b flex flex-col gap-2"
        >
          <label htmlFor="username" className="text-base font-semibold">
            Username
          </label>
          <input
            value={formData.username}
            onChange={handleChange}
            className="input bg-base-200 input-sm"
            type="text"
            id="username"
            name="username"
            placeholder="New username"
          />
          <label htmlFor="email" className="text-base font-semibold">
            Email
          </label>
          <input
            value={formData.email}
            onChange={handleChange}
            className="input bg-base-200 input-sm"
            type="email"
            id="email"
            name="email"
            placeholder="New email"
          />
          <label htmlFor="password" className="text-base font-semibold">
            Password
          </label>
          <input
            value={formData.password}
            onChange={handleChange}
            className="input bg-base-200 input-sm"
            type="password"
            id="password"
            name="password"
            placeholder="New password"
          />
          <label htmlFor="confirmPassword" className="text-base font-semibold">
            Confirm password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input bg-base-200 input-sm"
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
          />
        </form>
        {error && (
          <p className="text-red-500 text-sm sm:text-base translate-y-2">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between mt-5 gap-5">
          <button
            disabled={loading}
            onClick={handleDeleteModal}
            className="btn-xs h-10 flex-1 max-w-[100px] btn sm:btn-md btn-error"
          >
            Delete Profile
          </button>
          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={handleModal}
              className="btn-xs h-10 btn sm:btn-md btn-warning"
            >
              Close
            </button>
            <button
              disabled={loading}
              form="updateProfile"
              type="submit"
              className="btn-xs h-10 btn sm:btn-md btn-success"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      {openDeleteModal && (
        <div className="absolute bg-black/50 w-full min-h-screen top-0 left-0 flex items-center justify-center">
          <div className="bg-white min-h-[200px] container max-w-lg mx-5 p-5 rounded-xl shadow-xl flex flex-col justify-between">
            <p className="text-center sm:text-xl mt-3">
              Are you sure you want to delete your account?
            </p>
            <div className="w-full flex flex-row items-center justify-around mb-3">
              <button
                onClick={handleDeleteModal}
                className="btn-sm h-10 btn sm:btn-md btn-warning"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="btn-sm h-10 btn sm:btn-md btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfileModal;
