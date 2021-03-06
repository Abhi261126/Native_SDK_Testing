/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

jest
  .dontMock('AssetRegistry')
  .dontMock('../resolveAssetSource');

var AssetRegistry;
var Platform;
var SourceCode;
var resolveAssetSource;

function expectResolvesAsset(input, expectedSource) {
  var assetId = AssetRegistry.registerAsset(input);
  expect(resolveAssetSource(assetId)).toEqual(expectedSource);
}

describe('resolveAssetSource', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
    AssetRegistry = require('AssetRegistry');
    Platform = require('Platform');
    SourceCode = require('NativeModules').SourceCode;
    resolveAssetSource = require('../resolveAssetSource');
  });

  it('returns same source for simple static and network images', () => {
    var source1 = {uri: 'https://www.facebook.com/logo'};
    expect(resolveAssetSource(source1)).toBe(source1);

    var source2 = {isStatic: true, uri: 'logo'};
    expect(resolveAssetSource(source2)).toBe(source2);
  });

  it('does not change deprecated assets', () => {
    expect(resolveAssetSource({
      isStatic: true,
      deprecated: true,
      width: 100,
      height: 200,
      uri: 'logo',
    })).toEqual({
      isStatic: true,
      deprecated: true,
      width: 100,
      height: 200,
      uri: 'logo',
    });
  });

  it('ignores any weird data', () => {
    expect(resolveAssetSource(null)).toBe(null);
    expect(resolveAssetSource(42)).toBe(null);
    expect(resolveAssetSource('nonsense')).toBe(null);
  });

  describe('bundle was loaded from network (DEV)', () => {
    beforeEach(() => {
      SourceCode.scriptURL = 'http://10.0.0.1:8081/main.bundle';
    });

    it('uses network image', () => {
      expectResolvesAsset({
        __packager_asset: true,
        fileSystemLocation: '/root/app/module/a',
        httpServerLocation: '/assets/module/a',
        width: 100,
        height: 200,
        scales: [1],
        hash: '5b6f00f',
        name: 'logo',
        type: 'png',
      }, {
        isStatic: false,
        width: 100,
        height: 200,
        uri: 'http://10.0.0.1:8081/assets/module/a/logo.png?hash=5b6f00f',
      });
    });

    it('picks matching scale', () => {
      expectResolvesAsset({
        __packager_asset: true,
        fileSystemLocation: '/root/app/module/a',
        httpServerLocation: '/assets/module/a',
        width: 100,
        height: 200,
        scales: [1, 2, 3],
        hash: '5b6f00f',
        name: 'logo',
        type: 'png',
      }, {
        isStatic: false,
        width: 100,
        height: 200,
        uri: 'http://10.0.0.1:8081/assets/module/a/logo@2x.png?hash=5b6f00f',
      });
    });

  });

  describe('bundle was loaded from file (PROD) on iOS', () => {
    var originalDevMode;
    var originalPlatform;

    beforeEach(() => {
      SourceCode.scriptURL = 'file:///Path/To/Simulator/main.bundle';
      originalDevMode = __DEV__;
      originalPlatform = Platform.OS;
      __DEV__ = false;
      Platform.OS = 'ios';
    });

    afterEach(() => {
      __DEV__ = originalDevMode;
      Platform.OS = originalPlatform;
    });

    it('uses pre-packed image', () => {
      expectResolvesAsset({
        __packager_asset: true,
        fileSystemLocation: '/root/app/module/a',
        httpServerLocation: '/assets/module/a',
        width: 100,
        height: 200,
        scales: [1],
        hash: '5b6f00f',
        name: 'logo',
        type: 'png',
      }, {
        isStatic: true,
        width: 100,
        height: 200,
        uri: 'assets/module/a/logo.png',
      });
    });
  });

  describe('bundle was loaded from file (PROD) on Android', () => {
    var originalDevMode;
    var originalPlatform;

    beforeEach(() => {
      SourceCode.scriptURL = 'file:///Path/To/Simulator/main.bundle';
      originalDevMode = __DEV__;
      originalPlatform = Platform.OS;
      __DEV__ = false;
      Platform.OS = 'android';
    });

    afterEach(() => {
      __DEV__ = originalDevMode;
      Platform.OS = originalPlatform;
    });

    it('uses pre-packed image', () => {
      expectResolvesAsset({
        __packager_asset: true,
        fileSystemLocation: '/root/app/module/a',
        httpServerLocation: '/assets/AwesomeModule/Subdir',
        width: 100,
        height: 200,
        scales: [1],
        hash: '5b6f00f',
        name: '!@Logo#1_???', // Invalid chars shouldn't get passed to native
        type: 'png',
      }, {
        isStatic: true,
        width: 100,
        height: 200,
        uri: 'awesomemodule_subdir_logo1_',
      });
    });
  });

});

describe('resolveAssetSource.pickScale', () => {
  it('picks matching scale', () => {
    expect(resolveAssetSource.pickScale([1], 2)).toBe(1);
    expect(resolveAssetSource.pickScale([1, 2, 3], 2)).toBe(2);
    expect(resolveAssetSource.pickScale([1, 2], 3)).toBe(2);
    expect(resolveAssetSource.pickScale([1, 2, 3, 4], 3.5)).toBe(4);
    expect(resolveAssetSource.pickScale([3, 4], 2)).toBe(3);
    expect(resolveAssetSource.pickScale([], 2)).toBe(1);
  });
});
