import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../hooks/useAuth';
import { colors, radii, spacing } from '../../ui/theme';

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
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:colors.bg }} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <View style={{ flex:1, padding:spacing.xl, justifyContent:'center' }}>
        {/* Header */}
        <View style={{ alignItems:'center', marginBottom:spacing.xl }}>
          <View style={{ width:80, height:80, borderRadius:40, backgroundColor:colors.card, alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.1, shadowRadius:8, elevation:3 }}>
            <Ionicons name="flame" size={40} color={colors.danger} />
          </View>
          <Text style={{ fontSize:32, fontWeight:'700', marginTop:spacing.md, color:colors.text }}>EMU Alerts</Text>
          <Text style={{ color:colors.textTertiary }}>Fire Incident Management System</Text>
        </View>

        {/* Form */}
        <View style={{ backgroundColor:colors.card, borderRadius:radii.card, padding:spacing.lg, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:10, elevation:2 }}>
          {/* Email */}
          <View style={{ flexDirection:'row', alignItems:'center', borderColor:colors.border, borderWidth:1, borderRadius:radii.button, paddingHorizontal:spacing.md, marginBottom:spacing.md }}>
            <Ionicons name="mail" size={18} color={colors.textTertiary} style={{ marginRight:spacing.sm }} />
            <TextInput
              style={{ flex:1, height:44 }}
              placeholder="Email"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={{ flexDirection:'row', alignItems:'center', borderColor:colors.border, borderWidth:1, borderRadius:radii.button, paddingHorizontal:spacing.md }}>
            <Ionicons name="lock-closed" size={18} color={colors.textTertiary} style={{ marginRight:spacing.sm }} />
            <TextInput
              style={{ flex:1, height:44 }}
              placeholder="Password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={secure}
              autoCapitalize="none"
              value={pass}
              onChangeText={setPass}
            />
            <Pressable onPress={()=>setSecure(s=>!s)} hitSlop={10}>
              <Ionicons name={secure ? 'eye' : 'eye-off'} size={18} color={colors.textTertiary} />
            </Pressable>
          </View>

          {/* Forgot */}
          <Pressable onPress={onForgot} style={{ alignSelf:'flex-end', marginTop:spacing.sm }}>
            <Text style={{ color:colors.info }}>Forgot Password?</Text>
          </Pressable>

          {/* Sign in */}
          <Pressable
            onPress={()=>onLogin()}
            disabled={loading}
            style={({pressed})=>({
              marginTop:spacing.lg, backgroundColor: loading ? '#C7C7CC' : colors.danger,
              alignItems:'center', paddingVertical:spacing.md, borderRadius:radii.button,
              transform:[{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color:'#fff', fontWeight:'700' }}>Sign In</Text>}
          </Pressable>

          {/* Demo */}
          <Pressable onPress={onDemo} style={({pressed})=>({
            marginTop:spacing.md, backgroundColor: pressed ? '#eee' : colors.card,
            borderWidth:1, borderColor:colors.border, alignItems:'center',
            paddingVertical:spacing.md, borderRadius:radii.button
          })}>
            <Text style={{ color:colors.textSecondary, fontWeight:'600' }}>Employee Demo</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}