import React, { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../assets/netflix_spinner.gif";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Input } from "../components/FormElements";

const SignUp = () => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });

  const navigate = useNavigate();

  const validateForm = (value, field) => {
    let error = "";

    switch (field) {
      case "email":
        if (value.length === 0) {
          error = "Email is mandatory";
        } else {
          error = !/^\S+@\S+\.\S+$/.test(value)
            ? "Email should be in the correct format"
            : "";
        }
        break;
      case "password":
        if (value.length === 0) error = "Password is mandatory";
        else if (value.length < 5)
          error = "Password must have atleast 5 characters";
        break;

      case "confirmPass":
        if (value !== formValues.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    // Update the errors state
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  useEffect(() => {
    const setDisabledBtn = () => {
      const allFieldsFilled = Object.values(formValues).every(
        (value) => value !== ""
      );
      const isErrorFieldEmpty = Object.values(errors).every(
        (value) => value === ""
      );
      setDisabled(!(allFieldsFilled && isErrorFieldEmpty));
    };
    setDisabledBtn();
  }, [formValues, errors]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    validateForm(value, name);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSignUp = async () => {
    const { email, password } = formValues;
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACK_END + "/auth/signup",
        { email, password },
        {
          withCredentials: true,
        }
      );
      const message = response?.data?.message;

      if (response.status === 201) {
        toast.success(message || "Signup successful! You can now log in.");
        navigate("/login");
      } else {
        toast.error(message || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await handleSignUp();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={"Sign up"}>
      <div className="relative">
        <Input
          value={formValues.email}
          handleFormChange={handleFormChange}
          error={errors.email}
          name={"email"}
          label={"Email"}
        />
        <Input
          value={formValues.password}
          handleFormChange={handleFormChange}
          error={errors.password}
          name={"password"}
          label={"Password"}
        />
        <Input
          value={formValues.confirmPass}
          handleFormChange={handleFormChange}
          error={errors.confirmPass}
          type="password"
          name="confirmPass"
          label="Confirm Password"
        />
        {loading ? (
          <img
            className="h-10 w-10 rounded-full mx-auto"
            src={Loader}
            alt="loader"
          />
        ) : (
          <Button disabled={disabled} handleLogin={handleSubmit}>
            Sign Up
          </Button>
        )}
      </div>
      <div className="flex gap-2 text-sm">
        <div className="text-zinc-300">Already have an Account?</div>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
