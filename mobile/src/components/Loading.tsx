import { ActivityIndicator, View } from "react-native";

// All components starting with Uppercase
export function Loading() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090A'}}>
      <ActivityIndicator color={'#7C3AED'} size={60}/>
    </View>
  )
}