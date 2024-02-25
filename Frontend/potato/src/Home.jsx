/* eslint-disable no-unused-vars */
import { Box, Container, Typography } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import React, { useEffect, useState } from "react";
import "./Home.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";

import axios from "axios";

function Home() {
  const [file, setFile] = useState();
  const [fileurl, setFielurl] = useState();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function Loader() {
    return <Spinner animation="border" variant="success" />;
  }

  const sendFile = async () => {
    if (file) {
      console.log("file is there");
      let formData = new FormData();
      formData.append("file", file);

      try {
        let res = await axios.post(
          "https://us-central1-optimal-shard-410016.cloudfunctions.net/predict",
          formData
        );
        console.log("file sent");

        if (res.status === 200) {
          setResults(res.data);
          console.log(results);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error sending file:", error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    sendFile();
  }, [file]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  const fileTypes = ["JPG", "PNG"];

  function handleFile(file) {
    setFile(file);
    setFielurl(URL.createObjectURL(file));
    console.log("file uploaded");
  }
  return (
    <>
      <div className="m-20">
        <Typography
          sx={{
            color: "#C6A969",
            fontSize: 45,
            p: 2,
            bgcolor: "#597E52",
            textAlign: "center",
          }}
        >
          Tomato Disease Identification
        </Typography>
      </div>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // Set the height to 100% of viewport height
          flexDirection: "column", // Align items vertically
          marginTop: 30,
        }}
      >
        <Card
          style={{
            width: "30rem",
            height: "20rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card.Body>
            <Box>
              <FileUploader
                className="file-uploader"
                handleChange={handleFile}
                name="file"
                types={fileTypes}
                label={"upload your image"}
                hoverTitle="drop here"
              />
              {fileurl && (
                <div style={{ height: "100%" }}>
                  {loading ? (
                    <div className="loader">
                      <Loader />
                    </div>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ marginTop: 2, textAlign: "center" }}
                    >
                      Disease : {results["class_name"]}
                      <br />
                      confidence :{" "}
                      {Math.floor(results.confidance * 1000) / 1000}
                    </Typography>
                  )}
                </div>
              )}
            </Box>
          </Card.Body>
          {fileurl ? (
            <Card.Img
            variant="top"
            src={fileurl}
            style={{ width: "150px", height: "150px" }}
            alt="Image Alt Text"
            className="p-3"
          />
          ):(
            <div className="pre">
            <h5>Image Preview</h5>

            </div>
          )}
          
        </Card>
      </Container>
    </>
  );
}

export default Home;
