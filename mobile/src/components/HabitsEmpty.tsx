import { useNavigation } from "@react-navigation/native"
import { Text, TouchableOpacity, View } from "react-native"

import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

export function HabitsEmpty() {
  const { navigate } = useNavigation()

  return (
    <View className="flex-col gap-10 items-center">

      <Text
        className="text-zinc-400 text-lg"
      >
        Nenhum hábito disponível para hoje.
      </Text>
      
      <TouchableOpacity
        activeOpacity={0.7}
        className="justify-center h-11 px-4 border border-violet-500 rounded-lg"
        onPress={() => navigate('new')}
      >
        <View className="flex-row gap-2 items-center">
          <Feather
            name='plus'
            color={colors.violet[500]}
            size={25}
          />

          <Text className="text-zinc-200 font-semibold text-base">
            Crie agora seu novo Hábito!
          </Text>
        </View>
      </TouchableOpacity>
      
    </View>
  )
}