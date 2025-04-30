import { Camera, File, Image, Mic, Plus, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../../src/core/public/store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { sendMessage, getMessages, selectedUser } = useChatStore();
  const [isTextEntered, setIsTextEntered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [documentPreview, setDocumentPreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const documentInputRef = useRef(null);
  const audioStreamRef = useRef(null);


  
  const openCamera = async () => {
    setShowMenu(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Failed to access the camera:", error);
      toast.error("Unable to access the camera. Please check your permissions.");
    }
  };

  
  const handleDocumentChange = (e) => {
    setShowMenu(false);
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentPreview(file.name); 
    } else {
      toast.error("Please select a valid document.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(audioURL);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to access microphone:", error);
      toast.error("Microphone access denied.");
    }
  };

  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      setIsRecording(false); 
      mediaRecorderRef.current.stop();

      
      const stream = mediaRecorderRef.current.stream || mediaRecorderRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };


  
  const removeAudio = () => {
    setAudioBlob(null);
    setAudioURL(null);
  };


  
  const handleImageChange = (e) => {
    setShowMenu(false);
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop(); 
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null; 
    }

    setCameraStream(null);
    setIsCameraOpen(false);
  };

  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL("image/png");
      setImagePreview(imageData);
      closeCamera();
    }
  };

  
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  
  const handleSendMessage = async (e) => {
    e.preventDefault();

    
    if (isRecording) {
      stopRecording();
    }

    
    if (!text.trim() && !imagePreview && !audioBlob && !documentFile) return;

    try {
      const messageData = { text: text.trim() };

      
      if (documentFile) {
        const reader = new FileReader();
        reader.readAsDataURL(documentFile);
        reader.onloadend = async () => {
          
          messageData.document = reader.result;
          messageData.documentName = documentFile.name;

          
          await sendMessage(messageData);
          
          if (selectedUser) await getMessages(selectedUser._id);

          
          setDocumentFile(null);
          setDocumentPreview(null);
        };
      } else if (imagePreview) {
        messageData.image = imagePreview;
        await sendMessage(messageData);
        if (selectedUser) await getMessages(selectedUser._id);
      } else if (audioBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          messageData.audio = reader.result;
          await sendMessage(messageData);
          if (selectedUser) await getMessages(selectedUser._id);
          setAudioBlob(null);
          setAudioURL(null);
        };
      } else {
        await sendMessage(messageData);
        if (selectedUser) await getMessages(selectedUser._id);
      }

      setText("");
      setImagePreview(null);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.");
    }
  };


  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    setIsTextEntered(text.trim() !== "");
  }, [text]);

  return (
    <div className="p-4 w-full relative bg-white border-t">
      {/* Document Preview */}
      {documentPreview && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
          <File size={16} className="text-blue-600" />
          <span className="text-sm text-gray-700">{documentPreview}</span>
          <button 
            onClick={() => setDocumentPreview(null)} 
            className="ml-auto hover:bg-blue-100 p-1 rounded-full transition-colors"
          >
            <X size={16} className="text-blue-600" />
          </button>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md 
                flex items-center justify-center hover:bg-red-50 transition-colors"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-4 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl relative max-w-2xl w-full mx-4">
            <video ref={videoRef} autoPlay className="w-full max-h-[400px] rounded-lg" />
            <canvas ref={canvasRef} className="hidden" width={640} height={480} />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={captureImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors flex items-center gap-2"
              >
                <Camera size={18} />
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                  transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Preview */}
      {audioURL && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
          <audio controls src={audioURL} className="w-48 h-8" />
          <button 
            onClick={removeAudio}
            className="hover:bg-blue-100 p-1 rounded-full transition-colors"
          >
            <X className="size-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 
              transition-colors ${showMenu ? 'bg-gray-100' : ''}`}
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Attach file"
          >
            <Plus size={22} className="text-gray-600" />
          </button>
          
          {/* Attachment Menu */}
          {showMenu && (
            <div className="absolute bottom-16 left-0 w-48 bg-white shadow-lg rounded-xl 
              border border-gray-200 p-2 flex flex-col gap-1 animate-in slide-in-from-left-5">
              <button 
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors" 
                onClick={openCamera}
              >
                <Camera size={20} className="text-blue-600" />
                <span className="text-gray-700">Camera</span>
              </button>
              <button 
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors" 
                onClick={() => { setShowMenu(false); documentInputRef.current?.click() }}
              >
                <File size={20} className="text-blue-600" />
                <span className="text-gray-700">Document</span>
              </button>
              <button 
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => { setShowMenu(false); fileInputRef.current?.click() }}
              >
                <Image size={20} className="text-blue-600" />
                <span className="text-gray-700">Gallery</span>
              </button>
            </div>
          )}
        </div>

        {/* Audio Recording Button */}
        <button 
          type="button" 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'hover:bg-gray-100 text-gray-600'}`}
          onClick={isRecording ? stopRecording : startRecording}
          aria-label="Record Audio"
        >
          <Mic size={22} />
        </button>

        {/* Text Input */}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full py-2.5 px-4 rounded-full border border-gray-200 outline-none 
              bg-gray-50 focus:bg-white focus:border-blue-500 transition-colors shadow-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" className="hidden" ref={documentInputRef} onChange={handleDocumentChange} />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${(isTextEntered || imagePreview || audioBlob || documentFile)
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-gray-400'}`}
          disabled={!text.trim() && !imagePreview && !audioBlob && !documentFile}
          aria-label="Send message"
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
