import { Button, Input } from "../components/FormElements";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../assets/netflix_spinner.gif";
import React, { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateForm = (value, field) => {
    let error = "";

    switch (field) {
      case "email":
        // Validate email format
        if (value.length === 0) {
          error = "Email is mandatory";
        } else {
          error = !/^\S+@\S+\.\S+$/.test(value)
            ? "Email should be in the correct format"
            : "";
        }
        break;
      case "password":
        // Validate password format (8-15 characters, 1 upper, 1 lower, 1 number)
        if (value.length === 0) {
          error = "Password is mandatory";
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

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACK_END + "/auth/login",
        formValues,
        {
          withCredentials: true,
        }
      );
      const message = response?.data?.message;

      if (response.status === 200) {
        toast.success(message || "Login successful!");
        navigate("/home");
      } else {
        toast.error(message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred during login."
      );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await handleLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={"Log In"}>
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
        {loading ? (
          <img
            className="h-10 w-10 rounded-full mx-auto"
            src={Loader}
            alt="loader"
          />
        ) : (
          <Button disabled={disabled} handleLogin={handleSubmit}>
            Login
          </Button>
        )}
      </div>
      <div className="flex gap-2 text-sm">
        <div className="text-zinc-300">New to Netflix?</div>
        <Link to="/signup" className="hover:underline">
          Sign Up Now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
