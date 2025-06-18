import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Callback from "./components/Callback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<FileUpload />} />
      </Routes>
    </BrowserRouter>
  );
}
