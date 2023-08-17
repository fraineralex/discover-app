import { Share } from "react-native";

const SharePlace = (place) => {
  const imageUrl = place?.photos[0]?.photo_reference || ''; // Provide a valid image URL here

  Share.share({
    title: 'Share Business',
    message: `Check out the place: '${place.name}' at ${place.vicinity ? place.vicinity : place.formatted_address}`,
    url: imageUrl,
  });
};

export default {
  SharePlace,
};
