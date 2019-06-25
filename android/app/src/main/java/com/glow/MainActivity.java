package com.glow;

import com.facebook.react.ReactActivity;

import android.content.Intent; // react-native-orientation
import android.content.res.Configuration; // react-native-orientation
import com.facebook.react.ReactActivityDelegate; // react-native-gesture-handler
import com.facebook.react.ReactRootView; // react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView; // react-native-gesture-handler

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "glow";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
