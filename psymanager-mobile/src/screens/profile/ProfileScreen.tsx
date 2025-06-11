"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../auth/useAuth";
import { MotiView, MotiText } from "moti";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import LogoutConfirmModal from "../../components/modals/LogoutConfirmModal";
import profileStyles from "../styles/profileStyles";
import { theme } from "../styles/themeConstants";

const { colors } = theme;

const ProfileScreen: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getInitials = () => {
    if (!userInfo) return "?";
    return `${userInfo.firstName?.charAt(0) || ""}${
      userInfo.lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const accountMenuItems: {
    label: string;
    description?: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconBgColor?: string;
    iconColor?: string;
    onPress: () => void;
    badge?: boolean;
    badgeColor?: string;
  }[] = [
    {
      label: "Información personal",
      description: "Actualiza tus datos personales",
      icon: "account-edit-outline",
      iconBgColor: `${colors.primary.light}30`,
      iconColor: colors.primary.main,
      onPress: () => navigation.navigate("AccountSettings"),
    },
  ];

  const supportMenuItems: {
    label: string;
    description?: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconBgColor?: string;
    iconColor?: string;
    onPress: () => void;
  }[] = [
    {
      label: "Centro de ayuda",
      description: "Preguntas frecuentes y guías",
      icon: "help-circle-outline",
      iconBgColor: `${colors.warning.light}30`,
      iconColor: colors.warning.main,
      onPress: () => navigation.navigate("HelpCenter"),
    },

    {
      label: "Términos y condiciones",
      description: "Políticas de privacidad y uso",
      icon: "file-document-outline",
      iconBgColor: `${colors.grey[400]}30`,
      iconColor: colors.grey[600],
      onPress: () => navigation.navigate("TermsAndConditions"),
    },
  ];

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar
        backgroundColor={colors.background.default}
        barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de perfil */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 500 }}
        >
          <MotiView
            from={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "timing", duration: 700 }}
            style={profileStyles.profileSection}
          >
            <View style={profileStyles.avatarContainer}>
              {userInfo?.profilePicture ? (
                <Avatar.Image
                  size={100}
                  source={{ uri: userInfo.profilePicture }}
                  style={profileStyles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={100}
                  label={getInitials()}
                  style={profileStyles.avatar}
                  labelStyle={profileStyles.avatarText}
                />
              )}

              <TouchableOpacity
                style={profileStyles.editAvatarButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={18}
                  color={colors.background.paper}
                />
              </TouchableOpacity>
            </View>

            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 200, duration: 500 }}
              style={profileStyles.userName}
            >
              {userInfo?.firstName} {userInfo?.lastName}
            </MotiText>

            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 300, duration: 500 }}
              style={profileStyles.userRole}
            >
              Estudiante
            </MotiText>
          </MotiView>

          {/* Sección de cuenta */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100, duration: 500 }}
          >
            <View style={profileStyles.sectionHeader}>
              <MaterialCommunityIcons
                name="account-cog-outline"
                size={20}
                color={colors.primary.main}
                style={profileStyles.sectionIcon}
              />
              <Text style={profileStyles.sectionTitle}>Cuenta</Text>
            </View>

            <View style={profileStyles.menuList}>
              {accountMenuItems.map((item, index) => (
                <MotiView
                  key={`account-${index}`}
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 100 + index * 100, duration: 500 }}
                >
                  <TouchableOpacity
                    style={profileStyles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        profileStyles.menuIcon,
                        {
                          backgroundColor:
                            item.iconBgColor || `${colors.primary.light}30`,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={22}
                        color={item.iconColor || colors.primary.main}
                      />
                      {item.badge && (
                        <View
                          style={[
                            profileStyles.badge,
                            {
                              backgroundColor:
                                item.badgeColor || colors.success.main,
                            },
                          ]}
                        />
                      )}
                    </View>

                    <View style={profileStyles.menuTextContainer}>
                      <Text style={profileStyles.menuLabel}>{item.label}</Text>
                      {item.description && (
                        <Text style={profileStyles.menuDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={22}
                      color={colors.text.secondary}
                      style={profileStyles.chevron}
                    />
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Sección de soporte */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, duration: 500 }}
          >
            <View style={profileStyles.sectionHeader}>
              <MaterialCommunityIcons
                name="lifebuoy"
                size={20}
                color={colors.primary.main}
                style={profileStyles.sectionIcon}
              />
              <Text style={profileStyles.sectionTitle}>Soporte</Text>
            </View>

            <View style={profileStyles.menuList}>
              {supportMenuItems.map((item, index) => (
                <MotiView
                  key={`support-${index}`}
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 300 + index * 100, duration: 500 }}
                >
                  <TouchableOpacity
                    style={profileStyles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        profileStyles.menuIcon,
                        {
                          backgroundColor:
                            item.iconBgColor || `${colors.primary.light}30`,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={22}
                        color={item.iconColor || colors.primary.main}
                      />
                    </View>

                    <View style={profileStyles.menuTextContainer}>
                      <Text style={profileStyles.menuLabel}>{item.label}</Text>
                      {item.description && (
                        <Text style={profileStyles.menuDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={22}
                      color={colors.text.secondary}
                      style={profileStyles.chevron}
                    />
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Botón de cerrar sesión*/}
          <TouchableOpacity
            style={[profileStyles.menuItem, profileStyles.menuItemDanger]}
            onPress={() => setLogoutVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[profileStyles.menuIcon, profileStyles.dangerIcon]}>
              <MaterialCommunityIcons
                name="logout"
                size={22}
                color={colors.error.main}
              />
            </View>

            <View style={profileStyles.menuTextContainer}>
              <Text
                style={[profileStyles.menuLabel, profileStyles.menuLabelDanger]}
              >
                Cerrar sesión
              </Text>
              <Text style={profileStyles.menuDescriptionDanger}>
                Salir de tu cuenta
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={`${colors.error.main}99`}
              style={profileStyles.chevron}
            />
          </TouchableOpacity>

          {/* Información de versión y derechos */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600, duration: 500 }}
            style={profileStyles.footerContainer}
          >
            <Text style={profileStyles.versionText}>Versión 1.0.0</Text>
          </MotiView>
        </MotiView>
      </ScrollView>

      <LogoutConfirmModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={async () => {
          await logout();
          setLogoutVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
