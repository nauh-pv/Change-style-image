"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectOne from "./Select";
import data from "../../data/dataStyleTransfer.json";
import { postGenerateImage, postUploadImage } from "@/services/apiServices";
import { message } from "antd";
import CircleLoader from "react-spinners/CircleLoader";
import { FcImageFile } from "react-icons/fc";
import Webcam from "react-webcam";

const PageStyleSnap = () => {
  const [background, setBackground] = useState();
  const [preViewImage, setPreViewImage] = useState();
  const [imageCloud, setImageCloud] = useState();
  const [imageGenerate, setImageGenerate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCapture, setIsLoadingCapture] = useState(false);
  const [style, setStyle] = useState();
  const webcamRef = useRef(null);
  const [isCaptured, setIsCaptured] = useState(false); // Trạng thái quản lý chế độ video/ảnh

  const videoConstraints = {
    width: 768,
    height: 1024,
  };

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      // Chụp ảnh từ webcam
      const imageSrc = webcamRef.current.getScreenshot({ format: "image/png" });

      // Chuyển đổi base64 sang blob
      const byteString = atob(imageSrc.split(",")[1]);
      const mimeString = "image/png"; // Đặt MIME type cố định là PNG
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ia], { type: mimeString });

      // Đặt phần mở rộng file cố định là .png
      const fileExtension = ".png";

      // Tạo tên file với timestamp
      const today = new Date();
      const date =
        today.getSeconds() +
        "-" +
        today.getMinutes() +
        "-" +
        today.getHours() +
        "-" +
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      const newFileName = `face-image-${date}${fileExtension}`;

      // Tạo file từ blob với định dạng PNG
      const newFile = new File([blob], newFileName, {
        type: mimeString,
      });

      setPreViewImage(URL.createObjectURL(newFile));
      setIsCaptured(true);
      try {
        const res = await postUploadImage(newFile);
        console.log("check image", res);

        if (res.status === 200 || res.success === true) {
          // Tùy thuộc vào phản hồi API của bạn
          setImageCloud(res.data.filename);
        } else {
          throw new Error("Upload failed");
        }
      } catch (e) {
        console.error("Upload image error:", e);
        message.error("Upload image thất bại!");
      } finally {
        setIsLoadingCapture(false);
        message.success("Upload image thành công!");
      }
    } else {
      console.error("Webcam not accessible");
    }
  }, [webcamRef]);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    try {
      const res = await postGenerateImage(imageCloud, background, style);
      console.log(res);
      if (res.data.status === 200) {
        setImageGenerate(res.data.message[0].url);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      message.error("Don't generate image now!");
    } finally {
      setIsLoading(false);
    }
  };

  const checkDisableButton = () => {
    if (!isLoading && !isLoadingCapture) {
      if (background && style) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const retake = () => {
    setPreViewImage(null);
    setIsCaptured(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log(videoDevices); // Xem danh sách các camera có sẵn
    });
  }, []);

  useEffect(() => {
    navigator.permissions.query({ name: "camera" }).then((result) => {
      if (result.state === "denied") {
        console.error("Quyền truy cập camera bị từ chối");
      }
    });
    async function getVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 768, height: 1024 }, // Độ phân giải gốc của camera
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }

    getVideo();

    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        webcamRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full max-h-[94vh] h-[94vh] items-center justify-center p-4 bg-white">
      <div className="w-full items-center flex justify-center text-[40px] font-bold uppercase">
        Style Snap AI
      </div>
      <div className="flex w-full h-full gap-3">
        <div className="w-2/5 flex flex-col items-center gap-4 bg-slate-100 p-4 m-4 rounded-md border border-slate-200 shadow-2xl">
          <p className="text-2xl font-medium">
            {preViewImage ? "Preview Image" : "Live cam"}
          </p>
          {isCaptured ? (
            <div className="flex flex-col items-center gap-4">
              <div className="min-h-[70vh] max-h-[70vh] h-fit items-center flex">
                <img
                  src={preViewImage}
                  alt="Captured"
                  className="rounded-lg shadow-xl w-[100%] h-[100%]"
                />
              </div>
              <button
                disabled={isLoadingCapture}
                className={`rounded-lg px-5 py-2 text-white hover:text-slate-50 bg-slate-800 ${
                  isLoading || isLoadingCapture
                    ? "bg-slate-600 cursor-not-allowed hover:bg-slate-600"
                    : "hover:bg-slate-900"
                }`}
                onClick={retake}
              >
                Take picture again
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full gap-4">
              <div className="min-h-[70vh] max-h-[70vh] h-fit items-center flex">
                <Webcam
                  audio={false}
                  height={1024}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={768}
                  videoConstraints={videoConstraints}
                ></Webcam>
              </div>
              <button onClick={capture}>Chụp ảnh</button>
            </div>
          )}
        </div>
        <div className="w-2/5 flex flex-col items-center gap-4 bg-slate-100 p-4 m-4 rounded-md border border-slate-200 shadow-2xl font-medium">
          <p className="text-2xl">Image generate</p>
          <div className="min-h-[70vh] max-h-[70vh] h-fit items-center flex">
            {imageGenerate ? (
              <img
                src={imageGenerate}
                className="rounded-lg shadow-xl w-[100%] h-[100%]"
                alt="img"
              />
            ) : (
              <FcImageFile size={40} />
            )}
          </div>
        </div>
        <div className="w-1/5 flex flex-col gap-4 pr-5 bg-slate-100 p-4 m-4 rounded-md border border-slate-200 shadow-2xl">
          <p className="text-2xl font-medium">Setting</p>
          <div className="w-full flex flex-col gap-1">
            <p>Background</p>
            <SelectOne
              options={data.backgroundList}
              value={background}
              setValue={setBackground}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p>Style</p>
            <SelectOne
              options={data.styleList}
              value={style}
              setValue={setStyle}
            />
          </div>
          <button
            disabled={checkDisableButton()}
            onClick={handleGenerateImage}
            className={`rounded-lg w-full h-10 flex items-center justify-center text-white font-medium text-lg transition ease-in-out delay-150 
    ${
      checkDisableButton()
        ? "bg-gradient-to-tr from-sky-500 to-green-400 cursor-not-allowed"
        : "bg-gradient-to-tr from-sky-600 to-green-500 hover:bg-gradient-to-br hover:from-green-400 hover:to-cyan-600"
    }`}
          >
            {isLoading ? (
              <CircleLoader size={16} color="white" />
            ) : (
              "Generate image"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PageStyleSnap;
