# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# React Native Core
-keep class com.facebook.react.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}
-dontwarn com.facebook.react.**

# Hermes JS Engine
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keepclassmembers class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }
-keepclassmembers class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rns.** { *; }

# Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# React Native Maps & Google Play Services
-keep class com.rnmaps.maps.** { *; }
-keep class com.google.android.gms.maps.** { *; }
-dontwarn com.google.android.gms.**

# OkHttp / Retrofit / Axios
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# Annotations & Reflection
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# React Native ML Kit Barcode Scanning
-keep class com.rnmlkit.** { *; }
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.internal.mlkit_** { *; }
-dontwarn com.google.mlkit.**
-dontwarn com.google.android.gms.internal.mlkit_**

-keep class com.rt2zz.reactnativecontacts.** { *; }
-keepclassmembers class com.rt2zz.reactnativecontacts.** { *; }
-dontwarn com.rt2zz.reactnativecontacts.**

-keep class com.dylanvann.fastimage.** { *; }
-keep class com.imagepicker.** { *; }
-keep class com.reactnativecommunity.webview.** { *; }
-keep class com.brentvatne.** { *; }
-keep class com.horcrux.svg.** { *; }
