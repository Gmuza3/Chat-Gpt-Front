import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../Components/UI/Input/input";
import api from "../../Config/axios.api";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Modal from 'react-modal';
import { useState } from "react";

interface IFormInput {
  email: string;
  password: string;
}

const customStyles = {
  content: {
    top: "25%",
    left: "50%", 
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)", 
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
  },
};

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormInput>();
  
  const [modalIsOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setErrorMessage(null); 
  }

  const userLogin = async (user: IFormInput) => {
    const response = await api.post('/login', user);
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }

  const mutation = useMutation(userLogin, {
    onSuccess: (data) => {
      if (data) {
        navigate('/', { replace: true });
      }
      reset();
    },
    onError: (err: any) => {
      const errorResponse = err.response?.data?.message || 'Login failed';
      setErrorMessage(errorResponse); 
      openModal();
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutation.mutate(data);
  }

  return (
    <div className="w-full h-auto flex justify-center self-start pt-3">
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 bg-slate-700 w-[80%] max-w-[440px] flex flex-col gap-4 py-5">
        <h2 className="font-custom font-semibold text-[24px] flex justify-center items-center text-white">Login</h2>
        <Input
          label="Email"
          type="input"
          id="email"
          placeHolder="Enter Email"
          {...register("email", {
            required: {
              value: true,
              message: "Email is Required !!!",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Wrong Format",
            },
          })}
          isError={Boolean(errors.email)}
          textError={errors.email?.message}
        />
        <Input
          label="Password"
          type="input"
          id="password"
          placeHolder="Enter Password"
          {...register("password", {
            required: {
              value: true,
              message: "Password is Required !!!",
            },
          })}
          isError={Boolean(errors.password)}
          textError={errors.password?.message}
        />
        <div className='mt-4 flex items-center justify-between'>
          <button
            type="submit"
            className="cursor-pointer bg-transparent flex justify-center items-center font-custom text-[20px] text-slate-950 sm:max-w-[40%] w-[190px] h-[40px] border-[1px] border-solid rounded-[8px] border-transparent bg-white hover:bg-gray-300"
          >Login</button>
          <NavLink to={"/register"} className="flex justify-end hover:text-gray-300 text-white text-sm font-custom underline underline-offset-4 sm:w-[60%] w-[100%]">Create New Account</NavLink>
        </div>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Error Modal"
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold text-red-600">Login Error</h2>
          <p className="mt-3 text-gray-800">{errorMessage}</p>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
