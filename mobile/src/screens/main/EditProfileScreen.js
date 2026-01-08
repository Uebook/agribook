/**
 * Edit Profile Screen
 * Allows users to edit their profile information
 */

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Header from '../../components/common/Header';
import { userProfile } from '../../services/dummyData';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import apiClient from '../../services/api';
import {
  requestPermissionWithFallback,
  PERMISSIONS,
} from '../../utils/permissions';

// Create InputField component OUTSIDE to prevent recreation
const InputField = memo(({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  required = false,
  styles,
  placeholderColor,
  loading = false,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        blurOnSubmit={!multiline}
        returnKeyType={multiline ? 'default' : 'next'}
        editable={!loading}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if value or other important props change
  // onChangeText is stable via useCallback, so we don't need to compare it
  return (
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.keyboardType === nextProps.keyboardType &&
    prevProps.multiline === nextProps.multiline &&
    prevProps.required === nextProps.required &&
    prevProps.loading === nextProps.loading
  );
});

const EditProfileScreen = ({ navigation }) => {
  const { getThemeColors, getFontSizeMultiplier } = useSettings();
  const themeColors = getThemeColors();
  const fontSizeMultiplier = getFontSizeMultiplier();
  const { userRole, userData, userId, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUri, setAvatarUri] = useState(userData?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState(null); // Store selected file for upload
  const [formData, setFormData] = useState({
    name: userData?.name || userProfile.name,
    email: userData?.email || userProfile.email || '',
    mobile: userData?.mobile || userProfile.mobile || '',
    bio: userData?.bio || '',
    address: userData?.address || '',
    city: userData?.city || '',
    state: userData?.state || '',
    pincode: userData?.pincode || '',
    website: userData?.website || '',
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (userId && !userData) {
        try {
          const response = await apiClient.getUser(userId);
          const user = response.user;
          if (user) {
            setFormData({
              name: user.name || '',
              email: user.email || '',
              mobile: user.mobile || '',
              bio: user.bio || '',
              address: user.address || '',
              city: user.city || '',
              state: user.state || '',
              pincode: user.pincode || '',
              website: user.website || '',
            });
            setAvatarUri(user.avatar_url || null);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };
    loadUserData();
  }, [userId, userData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Create stable callback functions for each input field
  const handleNameChange = useCallback((value) => handleInputChange('name', value), [handleInputChange]);
  const handleEmailChange = useCallback((value) => handleInputChange('email', value), [handleInputChange]);
  const handleMobileChange = useCallback((value) => handleInputChange('mobile', value), [handleInputChange]);
  const handleBioChange = useCallback((value) => handleInputChange('bio', value), [handleInputChange]);
  const handleAddressChange = useCallback((value) => handleInputChange('address', value), [handleInputChange]);
  const handleCityChange = useCallback((value) => handleInputChange('city', value), [handleInputChange]);
  const handleStateChange = useCallback((value) => handleInputChange('state', value), [handleInputChange]);
  const handlePincodeChange = useCallback((value) => handleInputChange('pincode', value), [handleInputChange]);
  const handleWebsiteChange = useCallback((value) => handleInputChange('website', value), [handleInputChange]);

  // Memoize styles FIRST to ensure it's stable before InputField uses it
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 32,
      paddingVertical: 20,
    },
    avatarContainer: {
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: themeColors.primary.main,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      overflow: 'hidden',
      position: 'relative',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarText: {
      fontSize: 36 * fontSizeMultiplier,
      fontWeight: 'bold',
      color: themeColors.text.light,
    },
    avatarLoadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    changePhotoButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    changePhotoText: {
      fontSize: 14 * fontSizeMultiplier,
      color: themeColors.primary.main,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 18 * fontSizeMultiplier,
      fontWeight: 'bold',
      color: themeColors.text.primary,
      marginTop: 24,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14 * fontSizeMultiplier,
      fontWeight: '600',
      color: themeColors.text.primary,
      marginBottom: 8,
    },
    required: {
      color: themeColors.error || '#F44336',
    },
    input: {
      backgroundColor: themeColors.input.background,
      borderWidth: 1,
      borderColor: themeColors.input.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16 * fontSizeMultiplier,
      color: themeColors.input.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    saveButton: {
      backgroundColor: themeColors.button.primary,
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    saveButtonText: {
      color: themeColors.button.text,
      fontSize: 16 * fontSizeMultiplier,
      fontWeight: 'bold',
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    helpText: {
      fontSize: 12 * fontSizeMultiplier,
      color: themeColors.text.tertiary,
      textAlign: 'center',
      lineHeight: 18 * fontSizeMultiplier,
    },
  }), [themeColors, fontSizeMultiplier]);

  // Memoize placeholder color separately
  const placeholderColor = useMemo(() => themeColors.input.placeholder, [themeColors.input.placeholder]);

  const selectImageFromCamera = useCallback(async () => {
    const hasPermission = await requestPermissionWithFallback(
      PERMISSIONS.CAMERA,
      'Camera'
    );
    if (!hasPermission) {
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setAvatarUri(asset.uri || '');
          setAvatarFile({
            uri: asset.uri || '',
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `avatar_${Date.now()}.jpg`,
          });
        }
      }
    );
  }, []);

  const selectImageFromGallery = useCallback(async () => {
    const hasPermission = await requestPermissionWithFallback(
      PERMISSIONS.STORAGE,
      'Storage'
    );
    if (!hasPermission) {
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setAvatarUri(asset.uri || '');
          setAvatarFile({
            uri: asset.uri || '',
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `avatar_${Date.now()}.jpg`,
          });
        }
      }
    );
  }, []);

  const handleChangePhoto = useCallback(() => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: selectImageFromCamera,
        },
        {
          text: 'Gallery',
          onPress: selectImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, [selectImageFromCamera, selectImageFromGallery]);

  const handleSave = async () => {
    // Validate form
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (formData.email && !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (formData.mobile && formData.mobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    setLoading(true);

    try {
      // Upload avatar if a new one was selected
      let avatarUrl = avatarUri;
      if (avatarFile && avatarFile.uri && !avatarFile.uri.startsWith('http')) {
        // New image selected, upload it
        setUploadingAvatar(true);
        try {
          const uploadResult = await apiClient.uploadFile(
            avatarFile,
            'avatars',
            'users'
          );
          // Safely extract URL using bracket notation and 'in' operator
          if (uploadResult && typeof uploadResult === 'object' && !(uploadResult instanceof Error)) {
            avatarUrl = ('url' in uploadResult && uploadResult['url']) 
              ? uploadResult['url'] 
              : null;
            if (avatarUrl) {
              setAvatarUri(avatarUrl);
            }
          }
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          Alert.alert('Error', 'Failed to upload profile photo. Profile will be updated without photo.');
        } finally {
          setUploadingAvatar(false);
        }
      }

      // Update user via API
      if (userId) {
        const updatePayload = {
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          mobile: formData.mobile.trim() || null,
          bio: formData.bio.trim() || null,
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          pincode: formData.pincode.trim() || null,
          website: formData.website.trim() || null,
        };

        // Include avatar_url if we have one
        if (avatarUrl) {
          updatePayload.avatar_url = avatarUrl;
        }

        const response = await apiClient.updateUser(userId, updatePayload);

        console.log('Update response:', response); // Debug log

        // Update local user data - handle both response.user and direct user object
        const updatedUserData = response.user || response;
        if (updatedUserData) {
          await updateUserData(updatedUserData);
        } else {
          console.warn('No user data in response:', response);
          // Fallback: update with form data
          await updateUserData({
            ...userData,
            ...formData,
            avatar_url: avatarUrl,
          });
        }
      } else {
        // If no userId, just update local data
        await updateUserData({
          ...userData,
          ...formData,
          avatar_url: avatarUrl,
        });
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.message || error.error || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" navigation={navigation} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {formData.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                )}
                {uploadingAvatar && (
                  <View style={styles.avatarLoadingOverlay}>
                    <ActivityIndicator size="small" color={themeColors.text.light} />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={handleChangePhoto}
                disabled={uploadingAvatar || loading}
              >
                <Text style={styles.changePhotoText}>
                  {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <InputField
            label="Full Name"
            value={formData.name}
            onChangeText={handleNameChange}
            placeholder="Enter your full name"
            required={true}
            styles={styles}
            placeholderColor={placeholderColor}
            loading={loading}
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            required={true}
            styles={styles}
            placeholderColor={placeholderColor}
            loading={loading}
          />

          <InputField
            label="Mobile Number"
            value={formData.mobile}
            onChangeText={handleMobileChange}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            required={true}
            styles={styles}
            placeholderColor={placeholderColor}
            loading={loading}
          />

          {/* Bio Section */}
          <InputField
            label="Bio"
            value={formData.bio}
            onChangeText={handleBioChange}
            placeholder="Tell us about yourself..."
            multiline={true}
            styles={styles}
            placeholderColor={placeholderColor}
            loading={loading}
          />

          {/* Address Information */}
          <Text style={styles.sectionTitle}>Address Information</Text>

          <InputField
            label="Address"
            value={formData.address}
            onChangeText={handleAddressChange}
            placeholder="Enter your address"
            multiline={true}
            styles={styles}
            placeholderColor={placeholderColor}
            loading={loading}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="City"
                value={formData.city}
                onChangeText={handleCityChange}
                placeholder="City"
                styles={styles}
                placeholderColor={placeholderColor}
                loading={loading}
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="State"
                value={formData.state}
                onChangeText={handleStateChange}
                placeholder="State"
                styles={styles}
                placeholderColor={placeholderColor}
                loading={loading}
              />
            </View>
          </View>

          <InputField
            label="Pincode"
            value={formData.pincode}
            onChangeText={handlePincodeChange}
            placeholder="Enter pincode"
            keyboardType="numeric"
            styles={styles}
            placeholderColor={placeholderColor}
            loading={loading}
          />

          {/* Additional Information */}
          {userRole === 'author' && (
            <>
              <Text style={styles.sectionTitle}>Author Information</Text>
              <InputField
                label="Website"
                value={formData.website}
                onChangeText={handleWebsiteChange}
                placeholder="https://yourwebsite.com"
                keyboardType="url"
                styles={styles}
                placeholderColor={placeholderColor}
                loading={loading}
              />
            </>
          )}

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={themeColors.button.text} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.helpText}>
            * Required fields{'\n'}
            Your profile information will be updated immediately.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

