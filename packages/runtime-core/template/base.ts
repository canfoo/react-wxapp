export const baseWxml = 
`
<template name="TPL">
 <block wx:for="{{root.children}}" wx:key="*this">
  <template is="TPL_1_CONTAINER" data="{{i: item, a: ''}}" />
 </block>
</template>

<wxs module="_h">
  var elements = {};
  module.exports = {
    v: function(value) {
      return value !== undefined ? value : '';
    },
    t: function (type, ancestor) {
      var items = ancestor.split(',');
      var depth = 1;
      for (var i = 0; i < items.length; i++) {
        if (type === items[i]) {
          depth = depth + 1;
        }
      }

      var id = 'TPL_' + depth + '_' + type;
      return id;
    }
  };
</wxs>
  
    
<template name="TPL_1_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_2_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_3_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_4_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_5_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_6_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_7_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_8_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_9_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>
  
<template name="TPL_10_view">
  <view>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </view>
</template>

<template name="TPL_1_button">
  <button>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </button>
</template>

<template name="TPL_2_button">
  <button>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </button>
</template>

<template name="TPL_3_button">
  <button>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </button>
</template>

<template name="TPL_1_text">
  <text>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </text>
</template>

<template name="TPL_2_text">
  <text>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </text>
</template>

<template name="TPL_3_text">
  <text>
    <block wx:for="{{i.children}}" wx:key="*this">
      <template is="{{'TPL_' + (tid + 1) + '_CONTAINER'}}" data="{{i: item, a: a, tid: tid + 1 }}" />
    </block>
  </text>
</template>

<template name="TPL_1_plain-text" data="{{i: i}}">
 <block>{{i.text}}</block>
</template>

<template name="TPL_1_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 1}}" />
</template>

<template name="TPL_2_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 2}}" />
</template>

<template name="TPL_3_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 3}}" />
</template>

<template name="TPL_4_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 4}}" />
</template>

<template name="TPL_5_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 5}}" />
</template>

<template name="TPL_6_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 6}}" />
</template>

<template name="TPL_7_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 7}}" />
</template>

<template name="TPL_8_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 8}}" />
</template>

<template name="TPL_9_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 9}}" />
</template>

<template name="TPL_10_CONTAINER" data="{{i: i}}">
 <template is="{{_h.t(i.type, a)}}" data="{{i: i, a: a + ',' + i.type, tid: 10}}" />
</template>

`