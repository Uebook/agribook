/**
 * Subscription Screen
 * Shows available subscription plans and allows users to subscribe
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Header from '../../components/common/Header';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';

const RAZORPAY_KEY_ID = 'rzp_test_S10srfDgCfFXIL';

const SubscriptionScreen = ({ navigation }) => {
  const { getThemeColors, getFontSizeMultiplier } = useSettings();
  const { userId, userData } = useAuth();
  const themeColors = getThemeColors();
  const fontSizeMultiplier = getFontSizeMultiplier();

  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    if (userId) {
      fetchUserSubscriptions();
    }
  }, [userId]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Only fetch monthly subscriptions (per_book is default, no subscription needed)
      const response = await apiClient.getSubscriptions({ is_active: true, type: 'monthly' });
      setSubscriptions(response.subscriptionTypes || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      Alert.alert('Error', 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      const response = await apiClient.getUserSubscriptions(userId, 'active');
      setUserSubscriptions(response.subscriptions || []);
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
    }
  };

  const hasActiveSubscription = userSubscriptions.some(
    (sub) => sub.status === 'active' && (!sub.end_date || new Date(sub.end_date) > new Date())
  );

  const handleSubscribe = async (subscription) => {
    if (!userId) {
      Alert.alert('Error', 'Please login to subscribe');
      navigation.navigate('Login');
      return;
    }

    // Only monthly subscriptions can be subscribed to
    // Per book pay is the default (no subscription needed)
    if (hasActiveSubscription) {
      Alert.alert(
        'Active Subscription',
        'You already have an active subscription. Please wait for it to expire before subscribing to a new plan.',
        [{ text: 'OK' }]
      );
      return;
    }

    const amount = subscription.price * 100; // Convert to paise

    setProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await apiClient.request('/api/payments/razorpay/order', {
        method: 'POST',
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
        }),
      });

      if (!orderResponse.orderId) {
        throw new Error('Failed to create payment order');
      }

      const options = {
        description: subscription.name,
        image: 'https://your-app-logo.png',
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: amount,
        name: 'AgriBook',
        order_id: orderResponse.orderId,
        prefill: {
          email: userData?.email || '',
          contact: userData?.mobile || '',
          name: userData?.name || '',
        },
        theme: { color: themeColors.primary.main || '#10B981' },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          try {
            // Verify payment
            const verifyResponse = await apiClient.request('/api/payments/razorpay/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_signature: data.razorpay_signature,
              }),
            });

            if (!verifyResponse.success) {
              throw new Error('Payment verification failed');
            }

            // Create payment record
            const paymentResponse = await apiClient.request('/api/payments', {
              method: 'POST',
              body: JSON.stringify({
                user_id: userId,
                amount: subscription.price,
                payment_method: 'razorpay',
                transaction_id: data.razorpay_payment_id,
                subscription_type_id: subscription.id,
              }),
            });

            // Activate subscription
            const subscribeResponse = await apiClient.subscribeUser(
              userId,
              subscription.id,
              paymentResponse.payment?.id || null,
              false
            );

            if (subscribeResponse.success) {
              Alert.alert(
                'Subscription Activated! 🎉',
                `Your ${subscription.name} has been activated successfully!`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      fetchUserSubscriptions();
                      navigation.goBack();
                    },
                  },
                ]
              );
            }
          } catch (error) {
            console.error('Error processing subscription:', error);
            Alert.alert('Error', 'Failed to activate subscription. Please contact support.');
          } finally {
            setProcessing(false);
          }
        })
        .catch((error) => {
          console.error('Payment error:', error);
          if (error.code !== 'E_PAYMENT_CANCELLED') {
            Alert.alert('Payment Error', error.description || 'Payment failed. Please try again.');
          }
          setProcessing(false);
        });
    } catch (error) {
      console.error('Error initiating payment:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background.primary,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24 * fontSizeMultiplier,
      fontWeight: 'bold',
      color: themeColors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16 * fontSizeMultiplier,
      color: themeColors.text.secondary,
      marginBottom: 24,
    },
    subscriptionCard: {
      backgroundColor: themeColors.card?.background || themeColors.background.secondary,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: themeColors.border?.light || '#E0E0E0',
    },
    subscriptionCardActive: {
      borderColor: themeColors.primary.main,
      backgroundColor: themeColors.primary.light || themeColors.background.secondary,
    },
    subscriptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    subscriptionName: {
      fontSize: 20 * fontSizeMultiplier,
      fontWeight: 'bold',
      color: themeColors.text.primary,
      flex: 1,
    },
    subscriptionType: {
      fontSize: 12 * fontSizeMultiplier,
      color: themeColors.text.secondary,
      backgroundColor: themeColors.background.tertiary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    subscriptionDescription: {
      fontSize: 14 * fontSizeMultiplier,
      color: themeColors.text.secondary,
      marginBottom: 16,
      lineHeight: 20 * fontSizeMultiplier,
    },
    subscriptionPrice: {
      fontSize: 28 * fontSizeMultiplier,
      fontWeight: 'bold',
      color: themeColors.primary.main,
      marginBottom: 4,
    },
    subscriptionPriceLabel: {
      fontSize: 14 * fontSizeMultiplier,
      color: themeColors.text.tertiary,
      marginBottom: 16,
    },
    subscribeButton: {
      backgroundColor: themeColors.primary.main,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    subscribeButtonDisabled: {
      opacity: 0.6,
    },
    subscribeButtonText: {
      color: themeColors.text.light,
      fontSize: 16 * fontSizeMultiplier,
      fontWeight: '600',
    },
    activeBadge: {
      backgroundColor: themeColors.success || '#4CAF50',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    activeBadgeText: {
      color: '#FFFFFF',
      fontSize: 12 * fontSizeMultiplier,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Subscriptions" navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary.main} />
          <Text style={{ marginTop: 16, color: themeColors.text.secondary }}>
            Loading subscription plans...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Subscriptions" navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Select a subscription plan that works best for you
        </Text>

        {hasActiveSubscription && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>✓ You have an active subscription</Text>
          </View>
        )}

        {/* Per Book Pay Option (Default - No subscription needed) */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionName}>Per Book Pay</Text>
            <Text style={styles.subscriptionType}>Default</Text>
          </View>
          <Text style={styles.subscriptionDescription}>
            Pay for individual books as you read them. No subscription required.
          </Text>
          <Text style={styles.subscriptionPrice}>Pay per book</Text>
          <Text style={styles.subscriptionPriceLabel}>
            You'll be charged when you purchase a book
          </Text>
          <View style={[styles.subscribeButton, { backgroundColor: themeColors.background.secondary }]}>
            <Text style={[styles.subscribeButtonText, { color: themeColors.text.primary }]}>
              {hasActiveSubscription ? 'Available after subscription expires' : '✓ Current Plan'}
            </Text>
          </View>
        </View>

        {subscriptions.map((subscription) => {
          const isActive = userSubscriptions.some(
            (sub) =>
              sub.subscription_type_id === subscription.id &&
              sub.status === 'active' &&
              (!sub.end_date || new Date(sub.end_date) > new Date())
          );

          return (
            <View
              key={subscription.id}
              style={[
                styles.subscriptionCard,
                isActive && styles.subscriptionCardActive,
              ]}
            >
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionName}>{subscription.name}</Text>
                <Text style={styles.subscriptionType}>Monthly</Text>
              </View>

              {subscription.description && (
                <Text style={styles.subscriptionDescription}>
                  {subscription.description}
                </Text>
              )}

              <Text style={styles.subscriptionPrice}>
                ₹{subscription.price.toFixed(2)}/month
              </Text>
              {subscription.duration_days && (
                <Text style={styles.subscriptionPriceLabel}>
                  Valid for {subscription.duration_days} days
                </Text>
              )}

              {isActive ? (
                <View style={styles.subscribeButton}>
                  <Text style={styles.subscribeButtonText}>✓ Active</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    (processing || hasActiveSubscription) && styles.subscribeButtonDisabled,
                  ]}
                  onPress={() => handleSubscribe(subscription)}
                  disabled={processing || hasActiveSubscription}
                >
                  {processing ? (
                    <ActivityIndicator color={themeColors.text.light || '#FFFFFF'} />
                  ) : (
                    <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {subscriptions.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: themeColors.text.secondary }}>
              No subscription plans available at the moment.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;
