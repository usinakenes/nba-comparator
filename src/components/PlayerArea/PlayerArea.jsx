import{ useEffect, useState } from 'react'
import { Button, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ClearIcon from '@mui/icons-material/Clear';

import './PlayerArea.scss'
import { Box, padding, width } from '@mui/system'
import { teamColors } from '../../teamColors';

let emptyStats = {
  games_played: 0,
  min: 0,
  fgm: 0,
  fga: 0,
  fg3m: 0,
  fg3a: 0,
  ftm: 0,
  fta: 0,
  oreb: 0,
  dreb: 0,
  reb: 0,
  ast: 0,
  stl: 0,
  blk: 0,
  turnover: 0,
  pf: 0,
  pts: 0,
  fg_pct: 0,
  fg3_pct: 0,
  ft_pct: 0,
};

const PlayerArea = ({ boxes, box, removeBox, index }) => {

  let date = new Date();
  let year = date.getFullYear();

  const [playerSearch, setPlayerSearch] = useState('')
  const [results, setResults] = useState([])
  const [seasonAverages, setSeasonAverages] = useState({})
  const [step, setStep] = useState(0)
  const [chosenPlayer, setChosenPlayer] = useState({})
  const [selectedYear, setSelectedYear] = useState(year)

  let nbaSeasons = [];
  for (year; year > 1978; year--) {
    nbaSeasons.push(year);
  }
  
  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

useEffect(() => {
  fetch(`https://www.balldontlie.io/api/v1/players?search=${playerSearch}`)
    .then((response) => response.json())
    .then((data) => setResults(data.data));
}, [playerSearch])

useEffect(() => {
  if(chosenPlayer.id !== undefined){
    fetch(`https://www.balldontlie.io/api/v1/season_averages?season=${selectedYear}&player_ids[]=${chosenPlayer.id}`)
    .then((response) => response.json())
    .then((data) => {

      if(data.data.length === 0){
        setSeasonAverages(emptyStats)
      } else{
        setSeasonAverages(data.data[0])
      }
    });
  }
}, [selectedYear, chosenPlayer])

console.log(seasonAverages)

  return (
    <Paper elevation={3} sx={{p:'30px', width:'400px', position: 'relative', mb: 10}}>
      { (boxes.length !== 1) &&
        <ClearIcon 
          sx={{ position: 'absolute', fontSize: 20, top: 40, right: 30, color: '#999', px: 0, cursor: 'pointer'}}
          onClick={() => {
            removeBox(box.id)
          }}
        />
      }
      {step === 0 ? (
        <Box sx={{ width:'100%'}}>
          <Typography variant='h5'>Player {index+1}</Typography>
          <TextField
            sx={{ width:'100%', mt: 3}}
            label="Search for a player" 
            value={playerSearch} 
            onChange={(e) => setPlayerSearch(e.target.value)}     
            autoComplete="off"   
          />
          <List sx={{}}>
            { playerSearch === '' ? 
              <Typography mt={3} textAlign='center' sx={{fontWeight: 400, color: '#555'}}>Please enter a name.</Typography> :
              results.map((result) => (
                <ListItem 
                  key={result.id}
                  className='list-item' 
                  onClick={() => {
                      setChosenPlayer(result)
                      setStep(prev => prev + 1)
                  }} 
                >
                <ListItemText primary={result.first_name + ' ' + result.last_name} secondary={result.team.abbreviation + ' | ' + result.team.city + ' ' + result.team.name} />
                </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box>
          <Box sx={{position:'absolute', top:0, left: 0, height: '12px', width: '50%', bgcolor: teamColors(chosenPlayer.team.abbreviation).colors.colorOne}} />
          <Box sx={{position:'absolute', top:0, right: 0, height: '12px', width: '50%', bgcolor: teamColors(chosenPlayer.team.abbreviation).colors.colorTwo}} />
          <Button 
            sx={{textTransform: 'none', mt: 2}} 
            onClick={() => {
              setChosenPlayer({})
              setStep(prev => prev - 1)
            }}
          >
            <Stack sx={{color: '#555', transform: 'translateY(-10px)'}} direction='row' alignItems='center'>
              <ArrowBackIosIcon />
              <Typography fontSize={16}>Back</Typography>
            </Stack>
          </Button>
          <Stack direction='column' mt={2}>
            <Box>
              <Typography display='flex' flexDirection='column' variant='h4' sx={{fontWeight: 600}}>
                {chosenPlayer.first_name + ' ' + chosenPlayer.last_name}
              </Typography>
              <Typography display='flex' flexDirection='column' variant='h6' sx={{ color: "#666"}}>
                {chosenPlayer.team.abbreviation + ' | ' + chosenPlayer.team.city + ' ' + chosenPlayer.team.name}
              </Typography>
            </Box>
            <Stack direction='row' sx={{ borderBottom: '1px solid #ccc'}}>
              <Box mt={2} pr={5} sx={{borderRight: '1px solid #ccc', height: 'fit-content'}}>
                <Typography fontSize={16}><span style={{ fontWeight: 600}}>Position:</span> {chosenPlayer.position ? chosenPlayer.position : 'NA'}</Typography>
                <Typography fontSize={16}><span style={{ fontWeight: 600}}>Height:</span> {chosenPlayer.height_feet ? chosenPlayer.height_feet + "'" + chosenPlayer.height_inches + '"' : 'NA'}</Typography>
                <Typography fontSize={16}><span style={{ fontWeight: 600}}>Weight:</span> {chosenPlayer.weight_pounds ? chosenPlayer.weight_pounds + ' lbs' : 'NA'}</Typography>
              </Box>
              <FormControl sx={{ pb: 4, m: 3, flex:1}}>
                <InputLabel id="demo-simple-select-label">Season</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedYear}
                  label="Season"
                  onChange={handleChange}
                >
                  {nbaSeasons.map((season) => (
                    <MenuItem key={season} value={season}>{season}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Box direction='row' mt={3}>
              <Typography textAlign='center' mb={2} sx={{ fontSize: 18, fontWeight:600 }} >Season {selectedYear} Average Stats</Typography>
            </Box>
            <Box className='season-averages' display='flex' flexDirection='row' flexWrap='wrap' >
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex'>MINUTES</Typography>
                  <Typography fontSize={20} display='flex'>{seasonAverages.min}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>GAMES PLAYED</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.games_played}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>FIELD GOAL (%)</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{(seasonAverages.fg_pct * 1000) / 10}%</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>FIELD GOAL ATTEMPTS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.fga}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>FIELD GOALS MADE</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.fgm}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>THREE POINTER (%)</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.fg3_pct * 1000 / 10}%</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>THREE POINTER ATTEMPTS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.fg3a}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>THREE POINTERS MADE</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.fg3m}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>FREE THROW (%)</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.ft_pct * 1000/ 10}%</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>FREE THROW ATTEMPTS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.fta}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>FREE THROWS MADE</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.ftm}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>ASSISTS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.ast}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>BLOCKS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.blk}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>STEALS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.stl}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>PERSONAL FOULS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.pf}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>TURNOVERS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.turnover}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>REBOUNDS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.reb}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>OFFENSIVE REBOUNDS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.oreb}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' width={200} height={100} alignItems='center'>
                  <Typography fontSize={12} sx={{fontWeight: 600}} display='flex' gap={2}>DEFENSIVE REBOUNDS</Typography>
                  <Typography fontSize={20} display='flex' gap={2}>{seasonAverages.dreb}</Typography>
                </Box>
                
                
            </Box>
          </Stack>
        </Box>
        )
      }
    </Paper>
  )
}

export default PlayerArea