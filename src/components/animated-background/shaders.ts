
export const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

export const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 resolution;
  uniform float time;
  uniform vec2 xy;
  uniform float a_param;
  uniform float b_param;
  uniform float n_param;
  uniform float m_param;
  uniform int transitionSection; // New uniform to identify the current transition section

  void main(void) {
    const float PI = 3.14159265;
    vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;

    // Base time animation factors
    float tx = sin(time * 0.6)*0.05; 
    float ty = cos(time * 0.6)*0.05; 
    
    // Apply conditional time influence for purple transition
    float timeInfluence = 0.15;  // Default time influence
    if (transitionSection == 2) {  // Purple transition (Section 3 to Exit)
      timeInfluence = 0.35;  // Increase animation influence for purple transition
      // Add a bit more motion variation for this section
      tx = sin(time * 0.8) * 0.08; 
      ty = cos(time * 0.7) * 0.08;
    }

    float a = a_param + tx * timeInfluence;
    float b = b_param + tx * timeInfluence;
    float n = n_param + ty * timeInfluence;
    float m = m_param + ty * timeInfluence;

    float max_amp = abs(a) + abs(b);
    float amp = a * sin(PI*n*p.x) * sin(PI*m*p.y) + b * sin(PI*m*p.x) * sin(PI*n*p.y);
    float col = 1.0 - smoothstep(abs(amp), 0.0, 0.1);
    
    // Apply different color tinting based on transition section
    vec3 baseColor = vec3(col);
    vec3 finalColor;
    
    if (transitionSection == 0) {
      // Section 1 to 2 transition (blue tint)
      finalColor = mix(baseColor, vec3(0.5, 0.7, 1.0), 0.3);
    } else if (transitionSection == 1) {
      // Section 2 to 3 transition (green tint)
      finalColor = mix(baseColor, vec3(0.5, 1.0, 0.7), 0.3);
    } else if (transitionSection == 2) {
      // Section 3 to Exit transition (purple tint)
      finalColor = mix(baseColor, vec3(0.8, 0.5, 1.0), 0.3);
    } else {
      // Default/exit buffer transition (orange tint)
      finalColor = mix(baseColor, vec3(1.0, 0.7, 0.4), 0.3);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
