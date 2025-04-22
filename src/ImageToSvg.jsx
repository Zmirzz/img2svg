import React, { useState } from "react";
import { Button, Box, Typography, CircularProgress, Paper } from "@mui/material";
import ImageTracer from "imagetracerjs";

function ImageToSvg() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [svgContent, setSvgContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Placeholder conversion function (to be replaced with real logic or backend call)
  const convertToSvg = async (file) => {
    setLoading(true);
    setError("");
    setSvgContent(null);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          // Use ImageTracer to convert image data URL to SVG string
          ImageTracer.imageToSVG(ev.target.result, function(svgstr) {
            setSvgContent(svgstr);
            setLoading(false);
          }, "posterized2"); // posterized2 is a fast preset, can be adjusted
        } catch (err) {
          setError("Failed to convert image to SVG.");
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read image file.");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setError("Failed to convert image to SVG.");
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setSvgContent(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
    if (!imageFile) return;
    convertToSvg(imageFile);
  };

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Image to SVG Converter
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {imagePreview && (
            <Box>
              <Typography variant="subtitle2" align="center">Preview:</Typography>
              <img
                src={imagePreview}
                alt="preview"
                style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, margin: "8px 0" }}
              />
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            disabled={!imageFile || loading}
            onClick={handleConvert}
            sx={{ mt: 1 }}
          >
            Convert to SVG
          </Button>
          {loading && <CircularProgress size={28} sx={{ mt: 2 }} />}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {svgContent && (
            <Box sx={{ mt: 2, width: "100%" }}>
              <Typography variant="subtitle2" align="center">SVG Result:</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #eee",
                  borderRadius: 2,
                  background: "#fafafa",
                  p: 2,
                  mt: 1,
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2, width: "100%" }}
                onClick={handleDownload}
              >
                Download SVG
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default ImageToSvg;