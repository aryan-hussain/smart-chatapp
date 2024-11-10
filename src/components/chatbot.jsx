"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  MessageSquare,
  CircleArrowUp,
  Paperclip,
  Upload,
  X,
  Info,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Button as Button2,
  Card,
  CardBody,
  ListItem,
  ListItemPrefix,
  Typography,
  List,
  Textarea,
} from "@material-tailwind/react";

import {
  Button as ButtonMui,
  Modal,
  ModalDialog,
  Typography as TypographyMui,
} from "@mui/joy";

import axios from "axios";
import { circularAnimation } from "../../public/icons";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import BurgerIcon from "@/reusable/burgerIcon/burgerIcon";
import DrawerMenu from "@/reusable/drawerMenu/drawerMenu";
import FileChip from "@/reusable/fileChip/fileChip";
import { TextField } from "@mui/material";
import { formatText2 } from "@/lib/helper";
import Image from "next/image";
import { Toast, ToastContainer } from "./toaster/toaster";

export function Chatbot() {
  const [dragActive, setDragActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFilesBackend, setUploadedFilesBackend] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFileDrawer, setShowFileDrawer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [questionErrors, setQuestionErrors] = useState([]);
  const [openDropZoneModal, setOpenDropZoneModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);

  const errorTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const relatedQuestionsRef = useRef(null);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(
        "http://192.168.2.237:5001/api/uploaded-files"
      );
      console.log(response.data, "response fetchUploadedFiles");
      if (response.data && response.data?.statusCode === 200) {
        const files = JSON.parse(response.data?.body)?.data?.files;
        setUploadedFilesBackend(files);
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      handleError("Failed to fetch uploaded files");
    }
  };

  // Fetch uploaded files on initial load
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestionChange = (e, shortcutText = "") => {
    const value = shortcutText || e.target.value;
    setInputMessage(value);
  };

  const handleRelatedQuestionChange = (e, shortcutText = "") => {
    const value = shortcutText || e.target.value;
    setInputMessage(value);
    // Trigger handleSendMessage when a shortcut question is selected
    if (shortcutText) {
      handleSendMessage({ preventDefault: () => {} }, shortcutText);
    }
  };

  const shorcutQuestions = [
    { text: "What is Smart Invest?", icon: <MessageSquare size={20} /> },
    { text: "How to start investing?", icon: <MessageSquare size={20} /> },
    { text: "Investment strategies", icon: <MessageSquare size={20} /> },
    { text: "Risk management", icon: <MessageSquare size={20} /> },
  ];

  const suggestionQuestions = [
    "What is the current market trend?",
    "How do I diversify my portfolio?",
    "What are the risks of investing in cryptocurrencies?",
    "Can you explain dollar-cost averaging?",
  ];

  const showErrors = (errors) => {
    return errors.map((error, index) => (
      <Typography key={index} color="red" variant="small">
        {error}
      </Typography>
    ));
  };

  const handleSendMessage = async (e, overrideMessage = null) => {
    e.preventDefault();

    const messageToSend = overrideMessage?.trim() || inputMessage.trim();

    if (messageToSend) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        content: messageToSend,
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
      setIsResponseLoading(true);

      const skeletonMessage = {
        id: messages.length + 2,
        sender: "bot",
        content: null,
        isLoading: true,
      };
      setMessages((prevMessages) => [...prevMessages, skeletonMessage]);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/query`,
          { query: messageToSend },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log(JSON.parse(response.data.body), "lfkldfldkl");

        if (
          response &&
          (response?.data?.statusCode === 200 ||
            response?.data?.statusCode === 405)
        ) {
          const queryResponse =
            JSON.parse(response.data.body)?.data?.query_response ||
            "No Response";

          const relatedquestions = JSON.parse(response.data.body)?.data
            ?.proposed_questions;

          setRelatedQuestions(relatedquestions);

          const botResponse = {
            id: messages.length + 2,
            sender: "bot",
            content:
              queryResponse ||
              "I've received your message. How can I assist you further?",
          };
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === skeletonMessage.id ? botResponse : msg
            )
          );
        } else if (JSON.parse(response.data.body)?.message) {
          const botResponse = {
            id: messages.length + 2,
            sender: "bot",
            content:
              JSON.parse(response.data?.body) ||
              "I've received your message. How can I assist you further?",
          };
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === skeletonMessage.id ? botResponse : msg
            )
          );
        } else {
          handleError("Failed to get response from the API");
          throw new Error("Failed to get response from the API");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        handleError(`Failed to send message. Please try again. ${error}`);
        // Remove skeleton message on error
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== skeletonMessage.id)
        );
      } finally {
        setIsResponseLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      await handleSendMessage(e);
    }
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     await uploadFile(file);
  //   }
  // };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files) => {
    setIsUploading(true);
    const validFiles = files.filter(validateFile);

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      const fileData = await Promise.all(validFiles.map(readFileAsBase64));

      const data = {
        pdf_data_list: fileData.map(file => ({
          pdf_base64: file.base64String,
          filename: file.filename
        }))
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.data?.statusCode === 200) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        handleSuccess("All files uploaded successfully!");
        const botResponse = {
          id: messages.length + 1,
          sender: "bot",
          content: `I've received ${validFiles.length} PDF file(s). Let me know if you need any help with them.`,
          status: "success",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      handleError(`Failed to upload files. ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve({ filename: file.name, base64String });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      handleError(`${file.name} is not a PDF file.`);
      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      handleError(`${file.name} exceeds the 15MB size limit.`);
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    if (!validateAndSetFile(file)) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      const data = {
        pdf_base64: base64String,
      };

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (response.data?.statusCode === 200) {
          setIsFileUploaded(true);
          setUploadedFiles((prevFiles) => [...prevFiles, file]);
          handleSuccess("File uploaded successfully!");
          const botResponse = {
            id: messages.length + 1,
            sender: "bot",
            content: `I've received your PDF file: ${file.name}. Let me know if you need any help with it.`,
            status: "success",
          };
          setMessages((prevMessages) => [...prevMessages, botResponse]);
          // return response.data;
        } else {
          handleError(`Failed to upload file. Please try again.`);
          throw new Error("File upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        handleError(`Failed to upload file. Please try again. ${error}.`);
        const botResponse = {
          id: messages.length + 1,
          sender: "bot",
          content: `Failed to upload file. Please try again. ${error}.`,
          status: "success",
          isError: "true",
        };

        throw error;
      } finally {
        setIsUploading(false);
      }
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setIsUploading(false);
      };
    };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
    // validateAndSetFile(file);
  };

  const showErrorMessage = (message) => {
    setError(message);
    addToast(`${message}`, "error");
    setShowError(true);

    // Clear any existing timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    // Set a new timeout to hide the error after 5 seconds
    errorTimeoutRef.current = setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  const showSuccessMessage = (message) => {
    setSuccess(message);
    addToast(`${message}`, "success");

    setShowSuccess(true);

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleSuccess = (successMessage) => {
    showSuccessMessage(successMessage);
  };

  const handleError = (errorMessage) => {
    showErrorMessage(errorMessage);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    adjustChatContainerHeight();
    console.log("which is it triggering");

    window.addEventListener("resize", adjustChatContainerHeight);
    return () =>
      window.removeEventListener("resize", adjustChatContainerHeight);
  }, [relatedQuestions, isResponseLoading]);

  const adjustChatContainerHeight = () => {
    if (chatContainerRef.current) {
      if (isResponseLoading) {
        // Set height to 87vh when response is loading
        chatContainerRef.current.style.maxHeight = "87vh";
      } else if (relatedQuestionsRef.current) {
        const relatedQuestionsHeight = relatedQuestionsRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const newHeight = viewportHeight - relatedQuestionsHeight - 94; // 200px for other elements
        chatContainerRef.current.style.maxHeight = `${newHeight}px`;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const validateAndSetFile = (file) => {
    setError("");
    if (!file) return false;

    if (file.type !== "application/pdf") {
      handleError("Please upload a PDF file.");
      const botResponse = {
        id: messages.length + 1,
        sender: "bot",
        content: `Please upload a PDF file.`,
        status: "success",
        isError: "true",
      };
      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      // 5MB limit
      handleError("File size should not exceed 15MB.");
      const botResponse = {
        id: messages.length + 1,
        sender: "bot",
        content: `File size should not exceed 15MB.`,
        status: "success",
        isError: "true",
      };
      return false;
    }

    return true;
  };

  const truncateFilename = (filename, maxLength) => {
    if (filename.length > maxLength) {
      return `${filename.substring(0, maxLength)}...`;
    }
    return filename;
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleKeyDownFirst = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";

      if (textareaRef.current.scrollHeight !== 0) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [inputMessage]);

  const SkeletonMessage = () => (
    <div className="bg-[#ffffff] w-full rounded-lg p-4 max-w-[70%] animate-pulse">
      <div className="h-4 bg-[#ebebeb] rounded w-4/4 mb-2"></div>
      <div className="h-4 bg-[#ebebeb] rounded w-3/5"></div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen  bg-[#fff] text-[#000000]">
      <div className="hidden max991:block">
        <div className="flex justify-between px-2">
          <FileChip files={uploadedFiles} />
          <BurgerIcon isOpen={menuOpen} toggleMenu={toggleMenu} />
        </div>
        <DrawerMenu
          isOpen={menuOpen}
          files={uploadedFiles}
          removeFile={removeFile}
        />
      </div>
      <div className="flex-1 grid grid-cols-[250px_1fr] bg-[#f3f3ee] gap-1 p-2 max991:grid-cols-1 max991:p-2">
        {/* changing direction */}

        <div className="bg-[#0f172a] rounded-lg p-6 flex flex-col gap-4 bg-[#f3f3ee] max991:hidden">
          <Image
            src={"/logo.svg"}
            alt="logo not found"
            width={200}
            height={200}
          />

          <div className="mt-4">
            <h4 className="text-lg font-medium text-primaryColor mb-2">
              Uploaded Files:
            </h4>
            {uploadedFilesBackend.length > 0 ? (
              <div className="space-y-2 pr-[2px] overflow-y-auto h-[400px]">
                {uploadedFilesBackend.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#334155] bg-[transparent] rounded-lg p-0"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-secondaryColor" />
                      <span className="text-sm text-secondaryColor truncate">
                        {truncateFilename(file.filename, 20)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-[#94a3b8] text-secondaryColor ">
                No files uploaded yet.
              </p>
            )}
          </div>
        </div>
        <Drawer
          open={showFileDrawer}
          onOpenChange={setShowFileDrawer}
          placement="top"
          className="md:hidden"
        >
          <DrawerContent>
            <div className="bg-[#0f172a] rounded-lg shadow-lg p-6 flex flex-col gap-4 bg-back50per ">
              <p className="text-[#94a3b8]">
                Drag and drop your PDF files here to share them with the
                chatbot.
              </p>

              {showError && (
                <Alert
                  variant="destructive"
                  className={`transition-opacity duration-300 ${
                    showError ? "opacity-100" : "opacity-0 "
                  }`}
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {showSuccess && (
                <Alert
                  variant="default"
                  className="transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: showSuccess ? 1 : 0,
                    border: "2px solid #46f145",
                  }}
                >
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {isUploading ? (
                <>
                  <div className="flex gap-2 items-center">
                    <div role="status">
                      {circularAnimation}
                      <span className="sr-only">Loading...</span>
                    </div>
                    Uploading your file
                  </div>
                </>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed ${
                    dragActive
                      ? "border-[#0ea5e9] bg-[#0ea5e9]/10"
                      : "border-[#475569]"
                  } rounded-lg p-6 hover:border-[#0ea5e9] transition-colors cursor-pointer`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className="w-8 h-8 text-[#94a3b8]" />
                  <p className="text-[#94a3b8]">Click or drop PDF here</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
        <div className="flex flex-col justify-between h-full  bg-back50per rounded-lg ">
          {messages.length === 0 ? (
            <div className="flex flex-col w-full justify-center items-center h-full animate-fadeIn">
              <Card className="w-full max-w-[800px]  shadow-none">
                <CardBody className="flex flex-col item-center justify-center">
                  <Typography
                    variant="h2"
                    color="#13343b"
                    className="mb-5 text-center text-4xl max500:text-2xl font-normal text-primaryColor"
                  >
                    Where knowledge begins
                  </Typography>
                  <div className="relative w-full">
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      // color="#000"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#000",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#000",
                          },
                        },
                      }}
                      placeholder="Ask Anything.."
                      className="transition-all duration-300"
                      value={inputMessage}
                      onChange={handleQuestionChange}
                      onKeyDown={handleKeyDownFirst}
                      disabled={isProcessingQuestion}
                      // onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <div className="flex w-full justify-between py-5">
                      <div>{showErrors(questionErrors)}</div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => setShowFileDrawer(true)}
                          className="bg-[#ffffff] text-[#000000] hover:bg-[#ffffff] min991:hidden"
                        >
                          <Paperclip className="w-5 h-5" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setOpenDropZoneModal(true)}
                          className="bg-[#ffffff] text-[#000000] hover:bg-[#ffffff] max991:hidden"
                        >
                          <Paperclip className="w-5 h-5" />
                        </Button>
                        <Button2
                          size="sm"
                          className="rounded-md w-[150px] bg-primaryColor text-[#fff] transition-all duration-300"
                          onClick={handleSubmit}
                          disabled={isProcessingQuestion}
                        >
                          {isProcessingQuestion ? (
                            "Loading"
                          ) : (
                            <Typography
                              variant="small"
                              className="flex flex-row font-bold w-full gap-2 justify-center items-center"
                            >
                              <CircleArrowUp size={20} />
                              SEND
                            </Typography>
                          )}
                        </Button2>
                      </div>
                    </div>
                  </div>
                  <List className="grid grid-cols-2 max500:grid-cols-1 gap-4 p-0">
                    {shorcutQuestions.map((item, index) => (
                      <ListItem
                        key={item.text}
                        className="border py-2 bg-gray-50 gap-3 transition-all duration-300 animate-fadeIn"
                        onClick={(e) => handleQuestionChange(e, item.text)}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          color: "#13343b",
                        }}
                      >
                        <ListItemPrefix>{item.icon}</ListItemPrefix>
                        {item.text}
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </div>
          ) : (
            <>
              <div
                ref={chatContainerRef}
                className={`flex-1 overflow-y-auto p-4 max500:p-0 space-y-4 max-h-[87vh] max991:max-h-[82svh] transition-all duration-400 animate-fadeIn`}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#000000]">
                    <MessageSquare className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Welcome to Smart Invest
                    </h3>
                    <p>
                      Start your conversation by firstly uploading a PDF file.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-4 ${
                        message.sender === "bot" ? "justify-end" : ""
                      }`}
                    >
                      {message.sender === "user" && (
                        <Avatar className="rounded-[12%]">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                      )}

                      {message.isLoading ? (
                        <SkeletonMessage />
                      ) : (
                        <div
                          className={`rounded-lg p-2 max-w-[70%] ${
                            message.sender === "bot"
                              ? message.isError
                                ? "bg-[#ff4d4f] text-[#f1f5f9]"
                                : "bg-[#f7f7f7]"
                              : "bg-[#f7f7f7]"
                          }`}
                        >
                          <p>{formatText2(message.content)}</p>
                        </div>
                      )}

                      {message.sender === "bot" && (
                        <Avatar className="rounded-[12%]">
                          <AvatarImage src="/bot.svg" />
                          <AvatarFallback>CB</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
              </div>
              {!isResponseLoading && relatedQuestions.length > 0 && (
                <div ref={relatedQuestionsRef} className="p-4 ">
                  <h4 className="text-lg font-medium mb-2">
                    Related Questions:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relatedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        onClick={(e) =>
                          handleRelatedQuestionChange(e, question?.question)
                        }
                        className="text-left whitespace-pre-wrap bg-[#f3f3ee] hover:bg-gray-200 text-gray-800"
                      >
                        {question?.question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <form
            onSubmit={handleSendMessage}
            className={`${
              messages.length === 0 && "hidden"
            } flex relative items-center gap-2 p-4 max500:p-[0.5rem 0] rounded-b-[10px] border-t bg-[#0f172a00] `}
          >
            <Button
              type="button"
              onClick={() => setOpenDropZoneModal(true)}
              className="bg-[#ffffff] text-[#000000] hover:bg-[#ffffff] max991:hidden"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <textarea
              // type="text"
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-[#fff] text-[#000000] placeholder:text-[#94a3b8]"
              style={{
                overflow: "hidden",
                padding: "10px",
                resize: "none",
                outline: "none",
                borderRadius: "5px",
                height: "40px",
              }}
              rows={1}
            />
            <Button
              type="button"
              onClick={() => setShowFileDrawer(true)}
              className="bg-[#ffffff] text-[#000000] hover:bg-[#ffffff] min991:hidden"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              type="submit"
              disabled={isResponseLoading}
              className="bg-primaryColor text-[#f1f5f9] hover:bg-primaryColor"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
      <Modal
        open={openDropZoneModal}
        onClose={() => setOpenDropZoneModal(false)}
        sx={{
          width: "100%",
        }}
      >
        <ModalDialog
          variant="outlined"
          sx={{
            width: "50%",
          }}
        >
          <TypographyMui level="h4" className="mb-4">
            Share PDF File
          </TypographyMui>

          {showError && (
            <Alert
              variant="destructive"
              className={`transition-opacity duration-300 ${
                showError ? "opacity-100" : "opacity-0 "
              }`}
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showSuccess && (
            <Alert
              variant="default"
              className="transition-opacity duration-500 ease-in-out"
              style={{
                opacity: showSuccess ? 1 : 0,
                border: "2px solid #46f145",
              }}
            >
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {isUploading ? (
            <>
              <div className="flex gap-2 items-center">
                <div role="status">
                  {circularAnimation}
                  <span className="sr-only">Loading...</span>
                </div>
                Uploading your file
              </div>
            </>
          ) : (
            <>
              <div
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed ${
                  dragActive
                    ? "border-[#0ea5e9] bg-[#0ea5e9]/10"
                    : "border-[#475569]"
                } rounded-lg p-16 hover:border-[#0ea5e9] transition-colors cursor-pointer`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="w-8 h-8 text-[#94a3b8]" />
                <p className="text-[#94a3b8]">Click or drop PDF here</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-col gap-5 mt-4 ">
                <Typography
                  level="body-sm"
                  startDecorator={<Info size={16} />}
                  className="text-gray-600 "
                >
                  Max file size supported: 15 MB
                </Typography>
                <Typography
                  level="body-sm"
                  startDecorator={<Info size={16} />}
                  className="text-gray-600"
                >
                  Supported formats: pdf
                </Typography>
              </div>
            </>
          )}
          <ButtonMui
            variant="outlined"
            color="neutral"
            onClick={() => setOpenDropZoneModal(false)}
            className="mt-4"
          >
            Close
          </ButtonMui>
        </ModalDialog>
      </Modal>
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
