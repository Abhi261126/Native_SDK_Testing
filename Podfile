# Uncomment the next line to define a global platform for your project
platform :ios, '11.0'
target 'Native_SDK' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for Native_SDK

# Your 'node_modules' directory is probably in the root of your project,
  # but if not, adjust the `:path` accordingly
  pod 'React', :path => '../node_modules/react-native', :subspecs => [
      'Core',
#      'CxxBridge', # Include this for RN >= 0.47
#      'DevSupport', # Include this to enable In-App Devmenu if RN >= 0.43
      'RCTText',
      'RCTNetwork',
      'RCTWebSocket', # needed for debugging
      # Add any other subspecs you want to use in your project
    ]
    # Explicitly include Yoga if you are using RN >= 0.42.0
#    pod "yoga", :path => "../node_modules/react-native/ReactCommon/yoga"
#
#    # Third party deps podspec link
#    pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
#    pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
#    pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'


end

target 'Pods-Native_SDK_Example' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for Pods-Native_SDK_Example

end

target 'Pods-Native_SDK_Tests' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for Pods-Native_SDK_Tests

end