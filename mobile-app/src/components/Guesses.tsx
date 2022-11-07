import { FlatList, useToast } from 'native-base';
import { useState, useEffect } from 'react';
import {api} from '../services/api'
import {Game,GameProps} from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  const [games, setGames] = useState<GameProps[]>([]);

  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)
    } catch (error) {
      console.log(error);
      toast.show({
          title: 'Não foi possível carregar os detalhes do bolão',
          placement: 'top',
          bgColor: 'red.500'
      })
    } finally {
        setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
      });
      }
      console.log(poolId, gameId)

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });

      toast.show({
        title: 'Palpite enviado, boa sorte',
        placement: 'top',
        bgColor: 'green.500'
    })

    fetchGames()

    } catch (error) {
      console.log(error);
      toast.show({
          title: 'Não foi possível enviar o palpite',
          placement: 'top',
          bgColor: 'red.500'
      })
    }
  }

  useEffect(() => {
    fetchGames();
  },[poolId])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={()=> handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{pb:10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
