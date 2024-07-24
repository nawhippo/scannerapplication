package nategroup.medicationScanner.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
@Component
public class JwtUtil {
    private final SecretKey key;
    private final long EXPIRATION_TIME = 900000;


    public JwtUtil() {
        String secretString = System.getenv("JWT_SECRET");
        if (secretString == null || secretString.trim().isEmpty()) {
            throw new IllegalStateException("JWT_SECRET is not configured.");
        }
        byte[] decodedKey = Base64.getDecoder().decode(secretString);
        this.key = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
    }


    public String extractUsername(String token) {
        return extractClaim(token, Claims -> Claims.getSubject());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims -> Claims.getExpiration());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        System.out.println("Token at extraction:" + token);
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userDetails.getUsername().trim());
        return createToken(claims, userDetails.getUsername().trim());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        System.out.println("Claims Map: " + claims);
        return Jwts.builder()
                .setClaims(claims)
                //username
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }}