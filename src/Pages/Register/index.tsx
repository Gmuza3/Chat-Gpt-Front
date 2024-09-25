import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../Components/UI/Input/input";
import { useMutation } from "react-query";
import api from "../../Config/axios.api";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

interface IFormInput {
  name: string;
  surName: string;
  age: number;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const newUser = async (user: IFormInput) => {
    const response = await api.post("/register", user);
    return response.data;
  };
  const mutation = useMutation(newUser, {
    onSuccess: () => {
      reset();
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage =
            err.response.data.message || "Unknown error occurred";
          console.log("Error message:", errorMessage);
        } else {
          console.log("Axios Error:", err.message);
        }
      } else if (err instanceof Error) {
        console.log("General Error:", err.message);
      } else {
        console.log("An unknown error occurred:", err);
      }
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutation.mutate(data);
    navigate("/login");
  };

  return (
    <div className="w-full h-auto flex justify-center self-start pt-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-5 bg-slate-700 w-[80%] max-w-[440px] flex flex-col gap-4 py-5"
      >
        <h2 className="font-custom font-semibold text-[24px] flex justify-center items-center text-white">
          Register
        </h2>
        <Input
          label="First Name"
          type="input"
          id="firstName"
          placeHolder="Enter First Name"
          {...register("name", {
            required: {
              value: true,
              message: "First Name is Required !!!",
            },
          })}
          isError={Boolean(errors.name)}
          textError={errors.name?.message}
        />
        <Input
          label="SurName"
          type="input"
          id="surName"
          placeHolder="Enter SurName"
          {...register("surName", {
            required: {
              value: true,
              message: "SurName is Required !!!",
            },
          })}
          isError={Boolean(errors.surName)}
          textError={errors.surName?.message}
        />
        <Input
          label="Age"
          type="input"
          id="age"
          placeHolder="Enter Age"
          {...register("age", {
            required: {
              value: true,
              message: "Age is Required !!!",
            },
            min: {
              value: 3,
              message: "User must be over 16 years old",
            },
          })}
          isError={Boolean(errors.age)}
          textError={errors.age?.message}
        />
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
        <div className="w-full mt-4 flex items-center justify-between gap-5">
          <button
            type="submit"
            className="cursor-pointer bg-transparent flex justify-center items-center font-custom text-[20px] text-slate-950 sm:w-[45%] w-[160px] h-[40px] border-[1px] border-solid rounded-[8px] border-transparent bg-white hover:bg-gray-300 px-3"
          >
            Register
          </button>
          <span className="sm:w-[50%] text-stone-950 text-md font-custom sm:flex sm:flex-col sm:items-end">
            Already have an account?
            <NavLink
              to={"/login"}
              className="pl-2 underline underline-offset-4 font-custom hover:text-gray-300 text-white text-md"
            >
              Sign In
            </NavLink>
          </span>
        </div>
      </form>
    </div>
  );
}
