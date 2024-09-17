import React from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import ModelSelection from "./ModelSelection";
import ImageUpload from "./ImageUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/model-selection" element={<ModelSelection />} />
        <Route path="/image-upload/:selectedModel" element={<ImageUploadWrapper />} />
        <Route path="/" element={<ModelSelection />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

const ImageUploadWrapper = () => {
  const { selectedModel } = useParams();
  return <ImageUpload selectedModel={selectedModel} />;
};

export default App;
