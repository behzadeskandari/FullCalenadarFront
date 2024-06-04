import React from "react";

export default function Otp() {
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const inputRef = React.useRef([]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    if (value && index < otp.length - 1) {
      inputRef.current[index + 1].focus();
    }

    setOtp(newOtp);
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      inputRef.current[index - 1].focus();
      setOtp(newOtp);
    }
  };
  const styles = {
    width: "20px",
    height: "30px",
    textAlign: "center",
    border: "1px solid grey",
    margin: "5px",
    borderRadius: "5px",
  };
  const styles2 = {
    flexFlow: "column",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#efefef",
    alignItems: "center",
  };
  return (
    <>
      <div style={styles2}>
        <h2>OPT VERSION</h2>
        <p>Enter The 4-digit OTP you have recevied</p>
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              style={styles}
              key={index}
              className="otp-input"
              type="text"
              maxLength={1}
              value={digit}
              autoFocus={index === 0}
              ref={(ref) => (inputRef.current[index] = ref)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
