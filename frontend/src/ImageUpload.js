import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress, IconButton } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import cblogo from "./logo.PNG";
import backgroundImage from "./backgroundImage.png";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  appbar: {
    background: '#3366ff',
    boxShadow: 'none',
    color: 'white'
  },
  mainContainer: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  detail: {
    margin: "auto",
    textAlign: 'center',
  },
  cardMedia: {
    maxHeight: 300,
    width: 'auto',
    margin: '0 auto',
  },
  resultsContainer: {
    marginTop: theme.spacing(2),
  },
}));

const ImageUpload = () => {
  const classes = useStyles();
  const { selectedModel } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleCameraClick = () => {
    cameraInputRef.current.setAttribute("capture", "environment");
    cameraInputRef.current.click();
  };

  const sendFile = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Replace `localhost` with your computer's IP address
      const res = await fetch(`http://localhost:8000/predict/${selectedModel}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process image. Please try again.");
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    sendFile(file);
  };

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setError(null);
  };

  useEffect(() => {
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.text} variant="h6" noWrap>
            Plant Diseases Detection
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo} />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!preview ? classes.imageCardEmpty : ''}`}>
              {preview && (
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={preview}
                    title="Uploaded Image"
                    className={classes.cardMedia}
                  />
                </CardActionArea>
              )}
              {!preview && (
                <CardContent className={classes.content}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <IconButton onClick={handleCameraClick} color="primary">
                      <CameraAltIcon fontSize="large" />
                    </IconButton>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className={classes.input}
                      onChange={onSelectFile}
                    />
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className={classes.input}
                      onChange={onSelectFile}
                    />
                    <IconButton onClick={() => inputRef.current.click()} color="primary">
                      <CloudUploadIcon fontSize="large" />
                    </IconButton>
                  </div>
                </CardContent>
              )}
              <div className={classes.resultsContainer}>
              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{(parseFloat(data.confidence) * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" />
                  <Typography variant="subtitle1">Processing...</Typography>
                </CardContent>
              )}
              {error && (
                <CardContent className={classes.detail}>
                  <Typography color="error" variant="h6">
                    {error}
                  </Typography>
                </CardContent>
              )}
              {(data || error) && (
                <CardContent className={classes.detail}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={clearData}
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                </CardContent>
              )}
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </React.Fragment>
  );
};

export default ImageUpload;
