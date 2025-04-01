import React from "react";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/animations/loginAnimation.json";

const MyLottieAnimation: React.FC = () => {
  return (
    <Lottie
      animationData={loginAnimation}
      loop
      autoplay
      style={{ width: 800, height: 400 }}
    />
  );
};

export default MyLottieAnimation;
