import { Platform, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import WebListings from '@/components/WebListings';
import listingsData from '@/assets/data/airbnb-listings.json';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';

const Page = () => {
  const items = useMemo(() => listingsData as any, []);
  const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<string>('Tiny homes');
  const ListingsMap = Platform.OS === 'web' ? null : require('@/components/ListingsMap').default;
  const ListingsBottomSheet =
    Platform.OS === 'web' ? null : require('@/components/ListingsBottomSheet').default;

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, marginTop: 80 }}>
      {/* Define pour custom header */}
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {Platform.OS === 'web' ? (
        <WebListings listings={items} />
      ) : (
        <>
          <ListingsMap listings={getoItems} />
          <ListingsBottomSheet listings={items} category={category} />
        </>
      )}
    </View>
  );
};

export default Page;
