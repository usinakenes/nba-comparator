import { Button, Card, CardActions, CardContent, Box, Paper, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react'
import PlayerArea from '../../components/PlayerArea/PlayerArea';
import AddCircleIcon from '@mui/icons-material/AddCircle';


import './PlayerStats.scss'

const PlayerStats = () => {

  const [boxes, setBoxes] = useState([{id: 1}])
  const [latestID, setLatestID] = useState(1)

  console.log(boxes)

  const removeBox = id => {
    const removeArr = [...boxes].filter(box => box.id !== id)

    setBoxes(removeArr)
  }

  return (
    <Stack>
        <Box display='flex' gap={3} justifyContent='center' mt={5} >
            {boxes.map((box, index) => (
                <PlayerArea key={box.id} index={index} boxes={boxes} box={box} removeBox={removeBox} />
            ))}
            {
                boxes.length < 3 && (
                    <Paper 
                        elevation={3} 
                        sx={{p:'30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width:'100px', height: 'calc(100vh - 100px)', position: 'relative'}}
                        className='add-new'
                        onClick={() => {
                            setLatestID(prev => prev + 1)
                            setBoxes(boxes => [...boxes, {id: latestID + 1}])
                        }}
                    >
                        <Typography sx={{color: '#999', textAlign: 'center'}}>Add New</Typography>
                        <AddCircleIcon sx={{ mt: 0.5, color: '#999', fontSize: '24px'}} />
                    </Paper>
                )
            }
        </Box>
    </Stack>
  )
}

export default PlayerStats