package com.upit.asia;

import android.app.Application;
import android.app.NotificationManager;
import android.content.Context;
import android.app.NotificationChannel;
import android.media.AudioAttributes;
import android.net.Uri;
import com.upit.asia.R;
import com.facebook.react.ReactApplication;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.imagepicker.ImagePickerPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.swmansion.reanimated.ReanimatedPackage;
import java.util.Arrays;
import java.util.List;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage; 
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNInAppBrowserPackage(),
            new RNCWebViewPackage(),
          new MPAndroidChartPackage(),
          new CameraRollPackage(),
          new ImagePickerPackage(),
          new RNViewShotPackage(),
          new RNLocalizePackage(),
          new ReactNativeFirebaseMessagingPackage(),
          new ReactNativeFirebaseAppPackage(),
          new RNSpinkitPackage(),
          new AsyncStoragePackage(),
          new VectorIconsPackage(),
          new RNGestureHandlerPackage(),
          new ReanimatedPackage(),
          new ReactNativePushNotificationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    String idNotificationDefault = "fcm_fallback_notification_channel";
    NotificationChannel overideChannelDefault = new NotificationChannel(idNotificationDefault, "Upde Sound Notification", NotificationManager.IMPORTANCE_HIGH);
    overideChannelDefault.setDescription("Default Notification Channel With Custom Sound");
    Uri url = Uri.parse("android.resource://" + this.getPackageName() + "/" + R.raw.upde);
    AudioAttributes att = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build();
    overideChannelDefault.setSound(url, att);

    notificationManager.createNotificationChannel(overideChannelDefault);
  }
}
