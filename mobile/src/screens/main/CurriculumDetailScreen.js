/**
 * Curriculum Detail Screen
 * Features: View curriculum details, View PDF, Download PDF
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../components/common/Header';
import { useSettings } from '../../context/SettingsContext';
import apiClient from '../../services/api';

const CurriculumDetailScreen = ({ route, navigation }) => {
  const { curriculumId } = route.params || {};
  const { getThemeColors, getFontSizeMultiplier } = useSettings();
  const themeColors = getThemeColors();
  const fontSizeMultiplier = getFontSizeMultiplier();

  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingPDF, setViewingPDF] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurriculum();
  }, [curriculumId]);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCurriculum(curriculumId);
      setCurriculum(response.curriculum);
    } catch (err) {
      console.error('Error fetching curriculum:', err);
      setError('Failed to load curriculum details');
      Alert.alert('Error', 'Failed to load curriculum. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = () => {
    const pdfUrl = curriculum?.pdf_url;
    if (!pdfUrl) {
      Alert.alert('Error', 'PDF not available for this curriculum.');
      return;
    }
    setViewingPDF(true);
  };

  const handleDownloadPDF = async () => {
    // Download is restricted - only allow viewing in-app
    Alert.alert(
      'Download Restricted',
      'PDFs can only be viewed in the app. Use the "View PDF" button to read the curriculum.',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
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
    bannerImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 20,
      backgroundColor: themeColors.background.secondary,
    },
    title: {
      fontSize: 24 * fontSizeMultiplier,
      fontWeight: 'bold',
      color: themeColors.text.primary,
      marginBottom: 12,
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    badge: {
      fontSize: 12 * fontSizeMultiplier,
      color: themeColors.primary.main,
      backgroundColor: themeColors.primary.light || themeColors.background.secondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      fontWeight: '600',
    },
    description: {
      fontSize: 16 * fontSizeMultiplier,
      color: themeColors.text.secondary,
      lineHeight: 24 * fontSizeMultiplier,
      marginBottom: 24,
    },
    publishedDate: {
      fontSize: 14 * fontSizeMultiplier,
      color: themeColors.text.tertiary,
      marginBottom: 24,
    },
    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    viewButton: {
      flex: 1,
      backgroundColor: themeColors.primary.main,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    downloadButton: {
      flex: 1,
      backgroundColor: themeColors.success || '#4CAF50',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: themeColors.text.light,
      fontSize: 16 * fontSizeMultiplier,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    errorText: {
      fontSize: 16 * fontSizeMultiplier,
      color: themeColors.error || '#F44336',
      textAlign: 'center',
      marginTop: 16,
    },
    pdfViewerContainer: {
      flex: 1,
      backgroundColor: themeColors.background.primary,
    },
    pdfViewerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: themeColors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border?.light || '#E0E0E0',
    },
    pdfViewerTitle: {
      fontSize: 18 * fontSizeMultiplier,
      fontWeight: '600',
      color: themeColors.text.primary,
      flex: 1,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 24 * fontSizeMultiplier,
      color: themeColors.text.primary,
    },
    webView: {
      flex: 1,
    },
  });

  if (viewingPDF) {
    const pdfUrl = curriculum?.pdf_url;
    return (
      <View style={styles.pdfViewerContainer}>
        <View style={styles.pdfViewerHeader}>
          <Text style={styles.pdfViewerTitle} numberOfLines={1}>
            {curriculum?.title || 'PDF Viewer'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setViewingPDF(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{
            uri: pdfUrl,
            headers: {
              'Accept': 'application/pdf',
            },
          }}
          style={styles.webView}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // Prevent downloads - only view PDFs in-app
          onShouldStartLoadWithRequest={(request) => {
            // Only allow loading the PDF URL for viewing, block download attempts
            const url = request.url;
            // Allow the original PDF URL and PDF content, block download redirects
            if (url === pdfUrl || (url.includes('.pdf') && !url.includes('download') && !url.includes('attachment'))) {
              return true;
            }
            // Block any URLs that look like download links
            console.log('⚠️ Blocked potential download URL:', url);
            return false;
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={themeColors.primary.main} />
              <Text style={{ marginTop: 16, color: themeColors.text.primary }}>
                Loading PDF...
              </Text>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
            Alert.alert('Error', 'Failed to load PDF. Please try again.');
            setViewingPDF(false);
          }}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Curriculum Details" navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary.main} />
          <Text style={{ marginTop: 16, color: themeColors.text.primary }}>
            Loading curriculum...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !curriculum) {
    return (
      <View style={styles.container}>
        <Header title="Curriculum Details" navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Curriculum not found'}
          </Text>
          <TouchableOpacity
            style={[styles.viewButton, { marginTop: 20 }]}
            onPress={fetchCurriculum}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const bannerUrl = curriculum.banner_url || curriculum.banner;
  const stateName = curriculum.state_name || curriculum.state;
  const publishedDate = curriculum.published_date || curriculum.publishedDate;

  return (
    <View style={styles.container}>
      <Header title="Curriculum Details" navigation={navigation} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {bannerUrl && (
            <Image
              source={{ uri: bannerUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}

          <Text style={styles.title}>{curriculum.title}</Text>

          <View style={styles.metaContainer}>
            {stateName && (
              <Text style={styles.badge}>📍 {stateName}</Text>
            )}
            {curriculum.language && (
              <Text style={styles.badge}>🌐 {curriculum.language}</Text>
            )}
          </View>

          {curriculum.description && (
            <Text style={styles.description}>{curriculum.description}</Text>
          )}

          {publishedDate && (
            <Text style={styles.publishedDate}>
              Published: {new Date(publishedDate).toLocaleDateString()}
            </Text>
          )}

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.viewButton, { flex: 1 }]}
              onPress={handleViewPDF}
              disabled={!curriculum.pdf_url}
            >
              <Text style={styles.buttonText}>📄 View PDF</Text>
            </TouchableOpacity>
            {/* Download button removed - downloads are restricted, only viewing allowed */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CurriculumDetailScreen;
