import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../hooks/useAuth';

export default function Login(){
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onLogin(e = email, p = pass){
    if (!e || !p) {
      showMessage({ message:'Enter email and password', type:'warning' }); return;
    }
    try {
      setLoading(true);
      await signIn(e.trim(), p);
      showMessage({ message:'Signed in', type:'success' });
    } catch (err:any) {
      const msg = err?.message || 'Sign-in failed';
      showMessage({ message: msg, type:'danger' });
    } finally {
      setLoading(false);
    }
  }

  async function onDemo(){
    // Replace with a real demo user you created
    onLogin('demo@emualerts.app','DemoPass123!');
  }

  function onForgot(){
    showMessage({ message:'Password reset coming soon. Contact your supervisor.', type:'info' });
  }

  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:'#F8F9FA' }} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <View style={{ flex:1, padding:20, justifyContent:'center' }}>
        {/* Header */}
        <View style={{ alignItems:'center', marginBottom:24 }}>
          <View style={{ width:80, height:80, borderRadius:40, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.1, shadowRadius:8, elevation:3 }}>
            <Ionicons name="flame" size={40} color="#FF3B30" />
          </View>
          <Text style={{ fontSize:32, fontWeight:'700', marginTop:12 }}>EMU Alerts</Text>
          <Text style={{ color:'#8E8E93' }}>Fire Incident Management System</Text>
        </View>

        {/* Form */}
        <View style={{ backgroundColor:'#fff', borderRadius:16, padding:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:10, elevation:2 }}>
          {/* Email */}
          <View style={{ flexDirection:'row', alignItems:'center', borderColor:'#E5E5EA', borderWidth:1, borderRadius:12, paddingHorizontal:12, marginBottom:12 }}>
            <Ionicons name="mail" size={18} color="#8E8E93" style={{ marginRight:8 }} />
            <TextInput
              style={{ flex:1, height:44 }}
              placeholder="Email"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={{ flexDirection:'row', alignItems:'center', borderColor:'#E5E5EA', borderWidth:1, borderRadius:12, paddingHorizontal:12 }}>
            <Ionicons name="lock-closed" size={18} color="#8E8E93" style={{ marginRight:8 }} />
            <TextInput
              style={{ flex:1, height:44 }}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              secureTextEntry={secure}
              autoCapitalize="none"
              value={pass}
              onChangeText={setPass}
            />
            <Pressable onPress={()=>setSecure(s=>!s)} hitSlop={10}>
              <Ionicons name={secure ? 'eye' : 'eye-off'} size={18} color="#8E8E93" />
            </Pressable>
          </View>

          {/* Forgot */}
          <Pressable onPress={onForgot} style={{ alignSelf:'flex-end', marginTop:8 }}>
            <Text style={{ color:'#007AFF' }}>Forgot Password?</Text>
          </Pressable>

          {/* Sign in */}
          <Pressable
            onPress={()=>onLogin()}
            disabled={loading}
            style={({pressed})=>({
              marginTop:16, backgroundColor: loading ? '#C7C7CC' : '#FF3B30',
              alignItems:'center', paddingVertical:12, borderRadius:12,
              transform:[{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color:'#fff', fontWeight:'700' }}>Sign In</Text>}
          </Pressable>

          {/* Demo */}
          <Pressable onPress={onDemo} style={({pressed})=>({
            marginTop:12, backgroundColor: pressed ? '#eee' : '#fff',
            borderWidth:1, borderColor:'#E5E5EA', alignItems:'center',
            paddingVertical:12, borderRadius:12
          })}>
            <Text style={{ color:'#3A3A3C', fontWeight:'600' }}>Employee Demo</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}