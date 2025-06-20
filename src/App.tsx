import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, DialogContentText, TextField } from "@mui/material";
import './App.css'

function App() {
  const [actorName, setActorName] = useState('');
  const [openResults, setOpenResults] = useState(false);
  const [resultsData, setResultsData] = useState<any>();

  const handleSubmit = async () => {
    const response = await fetch(`/actor/${actorName}/movies`);
    if (response.ok) {
      const data = await response.json();
      setResultsData(data);
      handleOpen();
    }
  }

  const handleOpen = () => {
    setOpenResults(true);
    console.log('data: ', resultsData)

  }

  const handleClose = () => {
    setOpenResults(false);
  }

  return (
    <>
      <h1>Hello Vargonians</h1>
      <div>
        <DialogContentText>{"Search Danflicks.com movies by actor name (e.g. Tom Cruise, Philip Seymour Hoffman, Brad Pitt, etc.)"}</DialogContentText>
        <TextField
          fullWidth
          margin="normal"
          label="Input Actor"
          variant='standard'
          value={actorName}
          onChange={(e) => setActorName(e.target.value)}
        />


        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size='small' variant='contained' onClick={handleSubmit} >Submit</Button>
        </div>
      </div>

      <Dialog
        maxWidth={"xs"}
        fullWidth
        open={openResults}
        onClose={handleClose}
      >
        <DialogTitle>Movie Results:</DialogTitle>
        <DialogContent>

          {resultsData && resultsData.map((movie: any) => {
            return <h3>{`${movie.title} (${movie.releaseYear})`}</h3>
          })}


          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='small' variant='contained' onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>


      </Dialog>
    </>
  )
}

export default App
