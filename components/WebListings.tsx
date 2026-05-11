import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface Props {
  listings: any[];
}

const WebListings = ({ listings: items }: Props) => {
  return (
    <View style={defaultStyles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.webListContent}
        ListHeaderComponent={<Text style={styles.info}>{items.length} homes</Text>}
        renderItem={({ item }) => (
          <Link href={`/listing/${item.id}`} asChild>
            <TouchableOpacity>
              <View style={styles.listing}>
                <Image source={{ uri: item.medium_url }} style={styles.image} />
                <TouchableOpacity style={styles.favoriteBtn}>
                  <Ionicons name="heart-outline" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.rowBetween}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.rowGap}>
                    <Ionicons name="star" size={16} />
                    <Text style={styles.rating}>{item.review_scores_rating / 20}</Text>
                  </View>
                </View>
                <Text style={styles.subtle}>{item.room_type}</Text>
                <View style={styles.rowGap}>
                  <Text style={styles.price}>EUR {item.price}</Text>
                  <Text style={styles.subtle}>night</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webListContent: {
    paddingBottom: 140,
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: 4,
  },
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  favoriteBtn: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowGap: {
    flexDirection: 'row',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    maxWidth: '80%',
  },
  rating: {
    fontFamily: 'mon-sb',
  },
  subtle: {
    fontFamily: 'mon',
  },
  price: {
    fontFamily: 'mon-sb',
  },
});

export default WebListings;
