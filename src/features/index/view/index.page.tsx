import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexView() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-6 pt-6 dark:bg-slate-950">
      <Text className="text-center">Home View</Text>
    </SafeAreaView>
  );
}
