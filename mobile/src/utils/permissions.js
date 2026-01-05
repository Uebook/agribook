/**
 * Permission Utilities
 * Handles all app permissions (Storage, Camera, etc.)
 */

import { Platform, PermissionsAndroid, Alert, Linking, Settings } from 'react-native';

export const PERMISSIONS = {
  STORAGE: 'STORAGE',
  CAMERA: 'CAMERA',
  ALL: 'ALL',
};

/**
 * Get Android API level reliably
 */
const getAndroidApiLevel = () => {
  if (Platform.OS !== 'android') {
    return 0;
  }
  // Platform.Version returns the API level directly
  return Platform.Version || 0;
};

/**
 * Request storage permission for Android
 * Android 13+ (API 33+) uses granular media permissions
 * Android 12 and below use READ_EXTERNAL_STORAGE
 */
export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') {
    return true; // iOS handles permissions automatically
  }

  const apiLevel = getAndroidApiLevel();

  try {
    // Android 13+ (API 33+) - Use granular media permissions
    if (apiLevel >= 33) {
      // Request READ_MEDIA_IMAGES for images
      const imagesGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Storage Permission',
          message: 'App needs access to your photos to select images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      // For document picker on Android 13+, we might not need explicit permission
      // But we still request it for better compatibility
      // Note: Document picker uses system picker which doesn't require storage permission on Android 13+
      // However, image picker still needs READ_MEDIA_IMAGES
      
      return imagesGranted === PermissionsAndroid.RESULTS.GRANTED;
    } 
    // Android 12 and below (API 32 and below) - Use READ_EXTERNAL_STORAGE
    else if (apiLevel >= 23) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to select files and images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } 
    // Android 5.0 and below - Permissions granted at install time
    else {
      return true;
    }
  } catch (err) {
    console.warn('Error requesting storage permission:', err);
    return false;
  }
};

/**
 * Request camera permission
 */
export const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true; // iOS handles permissions automatically
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera to take photos',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Error requesting camera permission:', err);
    return false;
  }
};

/**
 * Check if storage permission is granted
 */
export const checkStoragePermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const apiLevel = getAndroidApiLevel();

  try {
    // Android 13+ (API 33+) - Check READ_MEDIA_IMAGES
    if (apiLevel >= 33) {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return result;
    } 
    // Android 12 and below (API 32 and below) - Check READ_EXTERNAL_STORAGE
    else if (apiLevel >= 23) {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return result;
    } 
    // Android 5.0 and below - Permissions granted at install time
    else {
      return true;
    }
  } catch (err) {
    console.warn('Error checking storage permission:', err);
    return false;
  }
};

/**
 * Check if camera permission is granted
 */
export const checkCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return result;
  } catch (err) {
    console.warn('Error checking camera permission:', err);
    return false;
  }
};

/**
 * Request all app permissions
 */
export const requestAllPermissions = async () => {
  const results = {
    storage: false,
    camera: false,
  };

  // Request storage permission (for images)
  // Note: Document picker on Android 13+ doesn't require storage permission
  results.storage = await requestStoragePermission();

  // Request camera permission
  results.camera = await requestCameraPermission();

  return results;
};

/**
 * Check if document picker needs storage permission
 * Android 13+ (API 33+) doesn't require storage permission for document picker
 */
export const needsStoragePermissionForDocuments = () => {
  if (Platform.OS !== 'android') {
    return false; // iOS doesn't need explicit permission
  }
  const apiLevel = getAndroidApiLevel();
  // Android 13+ uses system picker which doesn't need storage permission
  return apiLevel < 33;
};

/**
 * Request permission only if needed for the specific action
 * For document picker on Android 13+, we don't need to request permission
 */
export const requestPermissionIfNeeded = async (actionType) => {
  // For document picker on Android 13+, no permission needed
  if (actionType === 'document' && !needsStoragePermissionForDocuments()) {
    return true;
  }
  
  // For images, always need permission
  if (actionType === 'image') {
    return await requestStoragePermission();
  }
  
  // For camera, always need permission
  if (actionType === 'camera') {
    return await requestCameraPermission();
  }
  
  // Default: request storage permission
  return await requestStoragePermission();
};

/**
 * Show alert to open app settings if permission is denied
 */
export const showPermissionSettingsAlert = (permissionName) => {
  Alert.alert(
    'Permission Required',
    `${permissionName} permission is required for this feature. Please enable it in app settings.`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'android') {
            Linking.openSettings();
          } else {
            Linking.openURL('app-settings:');
          }
        },
      },
    ]
  );
};

/**
 * Request permission with fallback to settings
 * Handles "Don't ask again" / permanently denied permissions
 */
export const requestPermissionWithFallback = async (permissionType, permissionName) => {
  let hasPermission = false;

  switch (permissionType) {
    case PERMISSIONS.STORAGE:
      hasPermission = await checkStoragePermission();
      if (!hasPermission) {
        const result = await requestStoragePermission();
        hasPermission = result;
        
        // If permission was denied, check if it's permanently denied
        if (!hasPermission) {
          const apiLevel = getAndroidApiLevel();
          let checkResult = false;
          
          try {
            if (apiLevel >= 33) {
              checkResult = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
              );
            } else if (apiLevel >= 23) {
              checkResult = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
              );
            }
            
            // If still not granted, show settings alert
            if (!checkResult) {
              showPermissionSettingsAlert(permissionName || 'Storage');
            }
          } catch (err) {
            console.warn('Error checking permission status:', err);
            showPermissionSettingsAlert(permissionName || 'Storage');
          }
        }
      }
      break;
    case PERMISSIONS.CAMERA:
      hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        const result = await requestCameraPermission();
        hasPermission = result;
        
        if (!hasPermission) {
          const checkResult = await checkCameraPermission();
          if (!checkResult) {
            showPermissionSettingsAlert(permissionName || 'Camera');
          }
        }
      }
      break;
    default:
      break;
  }

  return hasPermission;
};

