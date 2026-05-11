import { View, StyleSheet, Text } from 'react-native';
import { defaultStyles } from '@/constants/Styles';

interface Props {
  listings: {
    features?: Array<{ properties?: { price?: number } }>;
  };
}

const ListingsMap = ({ listings }: Props) => {
  return (
    <View style={[defaultStyles.container, styles.container]}>
      <Text style={styles.title}>Map preview is disabled on web test mode</Text>
      <Text style={styles.caption}>
        {listings.features?.length ?? 0} listings are available in the list below.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontFamily: 'mon-b',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  caption: {
    fontFamily: 'mon',
    fontSize: 16,
    textAlign: 'center',
    color: '#5E5D5E',
  },
});

export default ListingsMap;
