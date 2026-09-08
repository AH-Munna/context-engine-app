import React, {useEffect, useMemo, useState} from 'react';
import {Image, Text, View, type ImageSourcePropType} from 'react-native';

type Props = {
  name: string;
  profileImage?: string | null;
  image?: ImageSourcePropType;
  size?: number;
};

const ProfileAvatar = ({name, profileImage, image, size = 44}: Props) => {
  const [imageFailed, setImageFailed] = useState(false);

  const remoteUri = useMemo(() => {
    if (profileImage && typeof profileImage === 'string') {
      return profileImage;
    }
    if (image && typeof image === 'object' && 'uri' in image && image.uri) {
      return String(image.uri);
    }
    return null;
  }, [profileImage, image]);

  useEffect(() => {
    setImageFailed(false);
  }, [remoteUri, name]);

  if (remoteUri && !imageFailed) {
    return (
      <Image
        source={{uri: remoteUri}}
        style={{width: size, height: size, borderRadius: size / 2}}
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (typeof image === 'number' && !imageFailed) {
    return (
      <Image
        source={image}
        style={{width: size, height: size, borderRadius: size / 2}}
        onError={() => setImageFailed(true)}
      />
    );
  }

  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#3B5BDB',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: '#FFFFFF', fontSize: size * 0.35, fontWeight: '700'}}>
        {initials || '?'}
      </Text>
    </View>
  );
};

export default ProfileAvatar;
