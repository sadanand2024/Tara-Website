import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import useAuth from 'hooks/useAuth';

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('✅ Google OAuth Success!');
      console.log('📊 Credential Response:', credentialResponse);

      // Decode the Google JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('👤 Decoded Google User Info:', decoded);

      // Extract user information from Google JWT
      const googleUser = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        email_verified: decoded.email_verified,
        auth_provider: 'google'
      };

      console.log('🚀 Processing Google login with user data:', googleUser);

      // Use the Google JWT credential as access token
      // In a real app, you might want to exchange this with your backend for your own tokens
      const accessToken = credentialResponse.credential;
      const refreshToken = null; // Google doesn't provide refresh token in this flow

      // Call your existing loginWithGoogle function
      loginWithGoogle(accessToken, refreshToken, googleUser);

      console.log('✅ Google login completed successfully!');
    } catch (error) {
      console.error('❌ Error processing Google login:', error);
      alert('Failed to process Google login. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google OAuth Login Failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="300"
      />
    </div>
  );
}

