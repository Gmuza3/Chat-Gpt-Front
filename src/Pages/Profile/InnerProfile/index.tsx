import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../../Config/axios.api";
import { ClipLoader } from "react-spinners";
import { CSSProperties, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../../Components/UI/Input/input";

const override: CSSProperties = {
  display: "block",
  margin: "0px 48px",
  borderColor: "black",
};

type Inputs = {
  name: string,
  surName: string,
  age: number,
  email: string;
};

const InnerProfile = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  
  const [edit, setEdit] = useState(false);
  const queryClient = useQueryClient();

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
  } = useQuery("profileData", getProfile, {
    onSuccess: (data) => {
      reset({
        name: data.name,
        surName: data.surName,
        age: data.age,
        email: data.email,
      });
    },
});

  const updateUser = async (data: Inputs) => {
    const res = await api.put("/update", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  };

  const mutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("profileData");
      setEdit(false);
    }
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <ClipLoader
          color={"#000"}
          loading={isLoading}
          cssOverride={override}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (isError) return <div>Error fetching profile</div>;

  return (
    <>
      {!edit ? (
        <div className="mt-14 w-full h-auto sm:w-full sm:px-[35px] px-[15px] max-w-[740px]">
          <ul className="border-[1px] border-solid rounded-t-md pl-3 pt-5 w-full sm:w-[90%]">
            <li className="font-custom tracking-normal text-xl mb-5 text-gray-200 capitalize">
              Name: {profileData.name}
            </li>
            <li className="font-custom tracking-normal text-xl mb-5 text-gray-200 capitalize">
              SurName: {profileData.surName}
            </li>
            <li className="font-custom tracking-normal text-xl mb-5 text-gray-200 capitalize">
              Age: {profileData.age}
            </li>
            <li className="font-custom tracking-normal text-xl mb-4 text-gray-200 capitalize">
              Email: {profileData.email}
            </li>
            <div className="w-[95%] flex items-center gap-6 justify-end">
              <button
                className="font-custom tracking-normal text-md mb-3 lg:text-xl text-white hover:text-red-500 uppercase"
                onClick={() => setEdit(true)}
              >
                edit
              </button>
            </div>
          </ul>
        </div>
      ) : (
        <div className="mt-14 w-full h-auto sm:w-full sm:px-[35px] px-[15px] max-w-[740px]">
          <form
            className="px-5 bg-slate-700 w-[100%] max-w-[440px] flex flex-col gap-4 py-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="First Name"
              type="input"
              id="firstName"
              placeHolder="Enter First Name"
              {...register("name", {
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "First Name should contain only letters",
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
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Surname should contain only letters",
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
                min:{
                  value:5,
                  message:'User must be over 5 years old'
                },
                max:{
                  value:100,
                  message: "Age should not exceed 100",
                }
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Wrong Format',
              },
              })}
              isError={Boolean(errors.email)}
              textError={errors.email?.message}
              readonly={true}
            />
            <div className="w-[95%] flex items-center gap-6 justify-end">
              <button
                type="submit"
                className="font-custom tracking-normal text-md mb-3 lg:text-xl hover:text-gray-300 text-white uppercase"
              >
                save
              </button>
              <button
                type="button"
                className="font-custom tracking-normal text-md mb-3 lg:text-xl hover:text-gray-300 text-white uppercase"
                onClick={() => setEdit(false)}
              >
                close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default InnerProfile;
